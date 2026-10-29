import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  Table,
  TableRow,
  TableCell,
  WidthType,
  AlignmentType,
  HeadingLevel,
  BorderStyle,
  ShadingType,
  ImageRun,
} from 'docx';
import { IngredientRow } from '../types';
import { CostingCalculations, CurrencyConfig, formatMoney, formatRawMoney } from './format';
import { saveOrShareFile } from './fileExporter';

export interface DocxExportOptions {
  groupNo: string;
  productName: string;
  memberNames: string;
  rows: IngredientRow[];
  calcs: CostingCalculations;
  currency: CurrencyConfig;
  headerImageUri?: string | null;
}

/**
 * Loads an image from data URI or URL into Uint8Array for docx ImageRun
 */
async function getImageBytes(src: string): Promise<Uint8Array | null> {
  try {
    if (src.startsWith('data:')) {
      const base64Index = src.indexOf('base64,');
      if (base64Index !== -1) {
        const base64 = src.substring(base64Index + 7);
        const binary = atob(base64);
        const bytes = new Uint8Array(binary.length);
        for (let i = 0; i < binary.length; i++) {
          bytes[i] = binary.charCodeAt(i);
        }
        return bytes;
      }
    }
    const res = await fetch(src);
    if (!res.ok) return null;
    const buf = await res.arrayBuffer();
    return new Uint8Array(buf);
  } catch (err) {
    console.warn('Failed to load image for Word document:', err);
    return null;
  }
}

// Border styles
const borderNone = { style: BorderStyle.NONE };
const borderLight = { style: BorderStyle.SINGLE, size: 2, color: 'CBD5E1' };
const borderAccent = { style: BorderStyle.SINGLE, size: 24, color: 'EA580C' };
const borderFractionLine = { style: BorderStyle.SINGLE, size: 12, color: '1E293B' };

const cellBorders = {
  top: borderLight,
  bottom: borderLight,
  left: borderLight,
  right: borderLight,
};

const cellBordersNone = {
  top: borderNone,
  bottom: borderNone,
  left: borderNone,
  right: borderNone,
};

/**
 * Helper to build an authentic mathematical stacked fraction in Word docx
 */
function createFractionBlock(
  prefix: string,
  numerator: string,
  denominator: string,
  prefixWidthPct = 22,
  fractionWidthPct = 78
): Table {
  return new Table({
    width: { size: 92, type: WidthType.PERCENTAGE },
    alignment: AlignmentType.CENTER,
    borders: {
      top: borderNone,
      bottom: borderNone,
      left: borderNone,
      right: borderNone,
      insideHorizontal: borderNone,
      insideVertical: borderNone,
    },
    rows: [
      new TableRow({
        children: [
          new TableCell({
            width: { size: prefixWidthPct, type: WidthType.PERCENTAGE },
            borders: cellBordersNone,
            children: [new Paragraph({ text: '', spacing: { before: 20, after: 20 } })],
          }),
          new TableCell({
            width: { size: fractionWidthPct, type: WidthType.PERCENTAGE },
            borders: {
              bottom: borderFractionLine,
              top: borderNone,
              left: borderNone,
              right: borderNone,
            },
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                spacing: { before: 20, after: 40 },
                children: [
                  new TextRun({
                    text: numerator,
                    bold: true,
                    size: 20,
                    font: 'Georgia',
                    color: '1E293B',
                  }),
                ],
              }),
            ],
          }),
        ],
      }),
      new TableRow({
        children: [
          new TableCell({
            width: { size: prefixWidthPct, type: WidthType.PERCENTAGE },
            borders: cellBordersNone,
            children: [
              new Paragraph({
                alignment: AlignmentType.RIGHT,
                spacing: { before: 40, after: 40 },
                children: [
                  new TextRun({
                    text: prefix,
                    bold: true,
                    size: 21,
                    font: 'Georgia',
                    color: '1E293B',
                  }),
                ],
              }),
            ],
          }),
          new TableCell({
            width: { size: fractionWidthPct, type: WidthType.PERCENTAGE },
            borders: cellBordersNone,
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                spacing: { before: 40, after: 40 },
                children: [
                  new TextRun({
                    text: denominator,
                    bold: true,
                    size: 20,
                    font: 'Georgia',
                    color: '1E293B',
                  }),
                ],
              }),
            ],
          }),
        ],
      }),
    ],
  });
}

/**
 * Helper to build a highlighted calculated result box
 */
function createResultHighlightBox(
  label: string,
  valueText: string,
  isAmber = false
): Table {
  const fillColor = isAmber ? 'FEF3C7' : 'FFF7ED';
  const borderColor = isAmber ? 'F59E0B' : 'EA580C';
  const textColor = isAmber ? '92400E' : '9A3412';
  const valueColor = isAmber ? 'B45309' : 'C2410C';

  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: {
      left: { style: BorderStyle.SINGLE, size: 20, color: borderColor },
      top: { style: BorderStyle.SINGLE, size: 4, color: borderColor },
      right: { style: BorderStyle.SINGLE, size: 4, color: borderColor },
      bottom: { style: BorderStyle.SINGLE, size: 4, color: borderColor },
    },
    rows: [
      new TableRow({
        children: [
          new TableCell({
            shading: { fill: fillColor, type: ShadingType.CLEAR },
            margins: { top: 80, bottom: 80, left: 140, right: 140 },
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                spacing: { before: 40, after: 40 },
                children: [
                  new TextRun({
                    text: `${label.toUpperCase()} :   `,
                    bold: true,
                    size: 19,
                    color: textColor,
                    font: 'Arial',
                  }),
                  new TextRun({
                    text: valueText,
                    bold: true,
                    size: 24,
                    color: valueColor,
                    font: 'Georgia',
                  }),
                ],
              }),
            ],
          }),
        ],
      }),
    ],
  });
}

/**
 * Helper to build a styled Step Formula Card matching the app's visual card design
 */
function createFormulaCard(
  stepNumber: number,
  title: string,
  description: string,
  innerTag: string,
  formulaRows: (Paragraph | Table)[],
  resultLabel: string,
  resultValue: string,
  isAmber = false
): Table {
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: {
      left: borderAccent,
      top: borderLight,
      right: borderLight,
      bottom: borderLight,
    },
    rows: [
      new TableRow({
        children: [
          new TableCell({
            shading: { fill: 'F8FAFC', type: ShadingType.CLEAR },
            margins: { top: 120, bottom: 120, left: 160, right: 160 },
            children: [
              // Header with Step Pill
              new Paragraph({
                spacing: { before: 40, after: 60 },
                children: [
                  new TextRun({
                    text: `[ STEP ${stepNumber} ]   `,
                    bold: true,
                    size: 22,
                    color: 'EA580C',
                    font: 'Arial',
                  }),
                  new TextRun({
                    text: title,
                    bold: true,
                    size: 24,
                    color: '0F172A',
                    font: 'Arial',
                  }),
                ],
              }),
              // Subtitle / description
              new Paragraph({
                spacing: { after: 120 },
                children: [
                  new TextRun({
                    text: description,
                    size: 19,
                    italics: true,
                    color: '475569',
                  }),
                ],
              }),
              // Inner formula tag
              new Paragraph({
                spacing: { after: 80 },
                children: [
                  new TextRun({
                    text: innerTag.toUpperCase(),
                    bold: true,
                    size: 18,
                    color: 'C2410C',
                    font: 'Arial',
                  }),
                ],
              }),
              // Step formulas & fractions
              ...formulaRows,
              // Spacing before result
              new Paragraph({
                spacing: { before: 80, after: 60 },
                children: [new TextRun({ text: '' })],
              }),
              // Prominent Result Callout Box
              createResultHighlightBox(resultLabel, resultValue, isAmber),
            ],
          }),
        ],
      }),
    ],
  });
}

/**
 * Generates an official Word Document (.docx) representing the Costing Worksheet
 * with high-quality formula card formatting, fractions, and highlight badges
 * identical to the application UI.
 */
export async function exportWorksheetToDocx(options: DocxExportOptions): Promise<void> {
  const {
    groupNo,
    productName,
    memberNames,
    rows,
    calcs,
    currency,
    headerImageUri,
  } = options;

  const safeName = (productName.trim() || 'Cooked_Product')
    .replace(/[^a-zA-Z0-9_-]/g, '_')
    .substring(0, 30);
  const fileName = `${safeName}_Costing_Worksheet.docx`;

  const {
    directCost,
    indirectCost,
    totalCost,
    servings,
    markupPercent,
    markupRate,
    unitCost,
    profitPerServing,
    pricePerServing,
    roundedPrice,
    totalSales,
    batchProfit,
    profitPerServingFromBatch,
  } = calcs;

  const docChildren: (Paragraph | Table)[] = [];

  // 1. Header Banner Image
  if (headerImageUri) {
    const imgBytes = await getImageBytes(headerImageUri);
    if (imgBytes) {
      const isPng = headerImageUri.toLowerCase().includes('image/png') || headerImageUri.toLowerCase().endsWith('.png');
      docChildren.push(
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 160 },
          children: [
            new ImageRun({
              data: imgBytes,
              transformation: {
                width: 580,
                height: 90,
              },
              type: isPng ? 'png' : 'jpg',
            }),
          ],
        })
      );
    }
  }

  // 2. Main Title & Subtitle
  docChildren.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      heading: HeadingLevel.HEADING_1,
      spacing: { before: 60, after: 40 },
      children: [
        new TextRun({
          text: 'Costing and Pricing of Cooked Products',
          bold: true,
          size: 32, // 16pt
          font: 'Georgia',
          color: '0F172A',
        }),
      ],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 160 },
      children: [
        new TextRun({
          text: 'Food Technology Worksheet',
          italics: true,
          size: 22,
          color: '64748B',
        }),
      ],
    })
  );

  // 3. Identity Information Table
  const identityTable = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: cellBorders,
    rows: [
      new TableRow({
        children: [
          new TableCell({
            shading: { fill: 'F1F5F9' },
            width: { size: 25, type: WidthType.PERCENTAGE },
            borders: cellBorders,
            children: [
              new Paragraph({
                children: [new TextRun({ text: 'Group No.', bold: true, size: 20 })],
              }),
            ],
          }),
          new TableCell({
            width: { size: 75, type: WidthType.PERCENTAGE },
            borders: cellBorders,
            children: [
              new Paragraph({
                children: [new TextRun({ text: groupNo.trim() || '—', size: 20 })],
              }),
            ],
          }),
        ],
      }),
      new TableRow({
        children: [
          new TableCell({
            shading: { fill: 'F1F5F9' },
            width: { size: 25, type: WidthType.PERCENTAGE },
            borders: cellBorders,
            children: [
              new Paragraph({
                children: [new TextRun({ text: 'Product Name', bold: true, size: 20 })],
              }),
            ],
          }),
          new TableCell({
            width: { size: 75, type: WidthType.PERCENTAGE },
            borders: cellBorders,
            children: [
              new Paragraph({
                children: [new TextRun({ text: productName.trim() || '—', bold: true, size: 20, color: 'EA580C' })],
              }),
            ],
          }),
        ],
      }),
      new TableRow({
        children: [
          new TableCell({
            shading: { fill: 'F1F5F9' },
            width: { size: 25, type: WidthType.PERCENTAGE },
            borders: cellBorders,
            children: [
              new Paragraph({
                children: [new TextRun({ text: 'Members', bold: true, size: 20 })],
              }),
            ],
          }),
          new TableCell({
            width: { size: 75, type: WidthType.PERCENTAGE },
            borders: cellBorders,
            children: [
              new Paragraph({
                children: [new TextRun({ text: memberNames.trim() || '—', size: 20 })],
              }),
            ],
          }),
        ],
      }),
    ],
  });

  docChildren.push(identityTable);

  // 4. Executive KPI Highlights Grid (4 summary metric cards matching app header)
  const kpiTable = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: cellBorders,
    rows: [
      new TableRow({
        children: [
          new TableCell({
            shading: { fill: 'F8FAFC' },
            width: { size: 25, type: WidthType.PERCENTAGE },
            borders: cellBorders,
            margins: { top: 60, bottom: 60, left: 80, right: 80 },
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [new TextRun({ text: 'TOTAL COST', bold: true, size: 17, color: '64748B' })],
              }),
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [new TextRun({ text: formatMoney(totalCost, currency), bold: true, size: 22, color: '0F172A' })],
              }),
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [new TextRun({ text: 'Direct + ½ Indirect', size: 16, color: '94A3B8' })],
              }),
            ],
          }),
          new TableCell({
            shading: { fill: 'F8FAFC' },
            width: { size: 25, type: WidthType.PERCENTAGE },
            borders: cellBorders,
            margins: { top: 60, bottom: 60, left: 80, right: 80 },
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [new TextRun({ text: 'UNIT COST', bold: true, size: 17, color: '2563EB' })],
              }),
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [new TextRun({ text: formatRawMoney(unitCost, currency), bold: true, size: 22, color: '1D4ED8' })],
              }),
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [new TextRun({ text: `${servings} Servings Yield`, size: 16, color: '94A3B8' })],
              }),
            ],
          }),
          new TableCell({
            shading: { fill: 'FFF7ED' },
            width: { size: 25, type: WidthType.PERCENTAGE },
            borders: cellBorders,
            margins: { top: 60, bottom: 60, left: 80, right: 80 },
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [new TextRun({ text: 'SELLING PRICE', bold: true, size: 17, color: 'EA580C' })],
              }),
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [new TextRun({ text: formatMoney(roundedPrice, currency), bold: true, size: 22, color: 'C2410C' })],
              }),
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [new TextRun({ text: `+${markupPercent}% Mark-up`, size: 16, color: '9A3412' })],
              }),
            ],
          }),
          new TableCell({
            shading: { fill: 'FEF3C7' },
            width: { size: 25, type: WidthType.PERCENTAGE },
            borders: cellBorders,
            margins: { top: 60, bottom: 60, left: 80, right: 80 },
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [new TextRun({ text: 'BATCH PROFIT', bold: true, size: 17, color: 'D97706' })],
              }),
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [new TextRun({ text: formatMoney(batchProfit, currency), bold: true, size: 22, color: 'B45309' })],
              }),
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [new TextRun({ text: `${formatMoney(profitPerServingFromBatch, currency)} / serving`, size: 16, color: '92400E' })],
              }),
            ],
          }),
        ],
      }),
    ],
  });

  docChildren.push(
    new Paragraph({ spacing: { before: 120, after: 60 }, children: [] }),
    kpiTable,
    new Paragraph({ spacing: { before: 120, after: 60 }, children: [] })
  );

  // 5. Section 1: Establish the Cost
  docChildren.push(
    new Paragraph({
      heading: HeadingLevel.HEADING_2,
      spacing: { before: 180, after: 60 },
      children: [
        new TextRun({
          text: '1. Establish the Cost (Ingredient Breakdown)',
          bold: true,
          size: 26,
          color: '0F172A',
        }),
      ],
    }),
    new Paragraph({
      spacing: { after: 120 },
      children: [
        new TextRun({
          text: 'The direct expenses incurred to purchase the necessary ingredients for the recipe.',
          size: 20,
          italics: true,
          color: '555555',
        }),
      ],
    })
  );

  // Table of Ingredients
  const ingredientTableRows: TableRow[] = [
    new TableRow({
      tableHeader: true,
      children: [
        new TableCell({
          borders: cellBorders,
          shading: { fill: 'E2E8F0' },
          width: { size: 15, type: WidthType.PERCENTAGE },
          children: [new Paragraph({ children: [new TextRun({ text: 'Qty', bold: true, size: 20 })] })],
        }),
        new TableCell({
          borders: cellBorders,
          shading: { fill: 'E2E8F0' },
          width: { size: 15, type: WidthType.PERCENTAGE },
          children: [new Paragraph({ children: [new TextRun({ text: 'Unit', bold: true, size: 20 })] })],
        }),
        new TableCell({
          borders: cellBorders,
          shading: { fill: 'E2E8F0' },
          width: { size: 45, type: WidthType.PERCENTAGE },
          children: [new Paragraph({ children: [new TextRun({ text: 'Particulars', bold: true, size: 20 })] })],
        }),
        new TableCell({
          borders: cellBorders,
          shading: { fill: 'E2E8F0' },
          width: { size: 25, type: WidthType.PERCENTAGE },
          children: [
            new Paragraph({
              alignment: AlignmentType.RIGHT,
              children: [new TextRun({ text: `Total (${currency.symbol})`, bold: true, size: 20 })],
            }),
          ],
        }),
      ],
    }),
  ];

  rows.forEach((row) => {
    ingredientTableRows.push(
      new TableRow({
        children: [
          new TableCell({
            borders: cellBorders,
            width: { size: 15, type: WidthType.PERCENTAGE },
            children: [new Paragraph({ children: [new TextRun({ text: row.qty || '—', size: 20 })] })],
          }),
          new TableCell({
            borders: cellBorders,
            width: { size: 15, type: WidthType.PERCENTAGE },
            children: [new Paragraph({ children: [new TextRun({ text: row.unit || '—', size: 20 })] })],
          }),
          new TableCell({
            borders: cellBorders,
            width: { size: 45, type: WidthType.PERCENTAGE },
            children: [new Paragraph({ children: [new TextRun({ text: row.name || '—', size: 20 })] })],
          }),
          new TableCell({
            borders: cellBorders,
            width: { size: 25, type: WidthType.PERCENTAGE },
            children: [
              new Paragraph({
                alignment: AlignmentType.RIGHT,
                children: [new TextRun({ text: formatMoney(row.cost, currency), size: 20 })],
              }),
            ],
          }),
        ],
      })
    );
  });

  // Footer Row: Total Cost / Ingredient Cost
  ingredientTableRows.push(
    new TableRow({
      children: [
        new TableCell({
          columnSpan: 3,
          borders: cellBorders,
          shading: { fill: 'F1F5F9' },
          children: [
            new Paragraph({
              alignment: AlignmentType.RIGHT,
              children: [new TextRun({ text: 'Total Cost / Ingredient Cost:', bold: true, size: 20 })],
            }),
          ],
        }),
        new TableCell({
          borders: cellBorders,
          shading: { fill: 'F1F5F9' },
          children: [
            new Paragraph({
              alignment: AlignmentType.RIGHT,
              children: [new TextRun({ text: formatMoney(directCost, currency), bold: true, size: 20 })],
            }),
          ],
        }),
      ],
    })
  );

  docChildren.push(
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: ingredientTableRows,
    })
  );

  // Step 1 Direct Cost Formula Card
  const directCostMath =
    rows.length > 0
      ? rows.map((r) => formatMoney(r.cost, currency)).join(' + ') + ' = ' + formatMoney(directCost, currency)
      : formatMoney(0, currency) + ' = ' + formatMoney(0, currency);

  const step1FormulaCard = createFormulaCard(
    1,
    'Establish Total Direct Cost',
    'Add up all ingredient expense lines to establish the total direct production cost.',
    'Total Direct Cost Formula = Add all ingredient costs',
    [
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 40, after: 60 },
        children: [
          new TextRun({
            text: directCostMath,
            bold: true,
            size: 21,
            font: 'Georgia',
            color: '1E293B',
          }),
        ],
      }),
    ],
    'Direct Ingredient Cost',
    formatMoney(directCost, currency)
  );

  docChildren.push(
    new Paragraph({ spacing: { before: 120, after: 60 }, children: [] }),
    step1FormulaCard,
    new Paragraph({ spacing: { before: 180, after: 60 }, children: [] })
  );

  // 6. Section 2: Compute the Unit Cost (With Stacked Fractions!)
  const step2Fraction1 = createFractionBlock(
    'Unit Cost  =',
    'Ingredient Cost + ½ of cost of ingredients',
    'No. of yields or servings',
    22,
    78
  );

  const step2Fraction2 = createFractionBlock(
    '= ',
    `${formatMoney(directCost, currency)} + ${formatMoney(indirectCost, currency)}`,
    `${servings} servings`,
    15,
    85
  );

  const step2Fraction3 = createFractionBlock(
    '= ',
    formatMoney(totalCost, currency),
    `${servings}`,
    15,
    85
  );

  const step2FormulaCard = createFormulaCard(
    2,
    'Compute the Unit Cost',
    'The unit cost is the cost incurred to sell the cooked product. Divide the cumulative expenses by the number of servings or yield produced.',
    'Module Formula (Vertical Fraction Representation):',
    [
      step2Fraction1,
      new Paragraph({ spacing: { before: 60, after: 60 }, children: [] }),
      step2Fraction2,
      new Paragraph({ spacing: { before: 60, after: 60 }, children: [] }),
      step2Fraction3,
    ],
    'Unit Cost per Serving',
    `${formatRawMoney(unitCost, currency)} per serving`
  );

  docChildren.push(
    step2FormulaCard,
    new Paragraph({ spacing: { before: 180, after: 60 }, children: [] })
  );

  // 7. Section 3: Pricing the Product
  const step3FormulaCard = createFormulaCard(
    3,
    'Pricing the Product',
    'Apply the mark-up to the unit cost to calculate the selling price per serving. Since the unit cost is already per serving, do not divide by servings again.',
    'Module Worked-Example Method:',
    [
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 40, after: 60 },
        children: [
          new TextRun({
            text: 'Selling Price per Serving = Unit Cost × (1 + Mark-up Rate)',
            bold: true,
            size: 21,
            font: 'Georgia',
            color: '1E293B',
          }),
        ],
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 30, after: 30 },
        children: [
          new TextRun({
            text: `= ${formatRawMoney(unitCost, currency)} × (1 + ${markupRate.toFixed(2)})`,
            size: 20,
            font: 'Georgia',
          }),
        ],
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 30, after: 30 },
        children: [
          new TextRun({
            text: `= ${formatRawMoney(unitCost, currency)} × ${(1 + markupRate).toFixed(2)}`,
            size: 20,
            font: 'Georgia',
          }),
        ],
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 30, after: 30 },
        children: [
          new TextRun({
            text: `= ${formatRawMoney(pricePerServing, currency, 5)}`,
            size: 20,
            font: 'Georgia',
            color: '64748B',
          }),
        ],
      }),
    ],
    'Final Selling Price',
    `${formatMoney(pricePerServing, currency)} per serving`
  );

  docChildren.push(
    step3FormulaCard,
    new Paragraph({ spacing: { before: 180, after: 60 }, children: [] })
  );

  // 8. Section 4: Compute the Profit
  const step4FormulaCard = createFormulaCard(
    4,
    'Compute the Profit',
    'Multiply the selling price per serving by the number of servings to find total sales. Then subtract total production cost to find batch profit.',
    'Profit Formula:',
    [
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 40, after: 60 },
        children: [
          new TextRun({
            text: 'Total Profit = (Selling Price per Serving × Servings) − Total Production Cost',
            bold: true,
            size: 20,
            font: 'Georgia',
            color: '1E293B',
          }),
        ],
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 30, after: 30 },
        children: [
          new TextRun({
            text: `= ${formatMoney(roundedPrice, currency)} × ${servings} = ${formatMoney(totalSales, currency)} total sales`,
            size: 20,
            font: 'Georgia',
          }),
        ],
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 30, after: 30 },
        children: [
          new TextRun({
            text: `= ${formatMoney(totalSales, currency)} − ${formatMoney(totalCost, currency)}`,
            size: 20,
            font: 'Georgia',
          }),
        ],
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 30, after: 30 },
        children: [
          new TextRun({
            text: `Profit per Serving = Total Profit ÷ Servings = ${formatMoney(profitPerServingFromBatch, currency)}`,
            size: 19,
            font: 'Georgia',
            color: '64748B',
          }),
        ],
      }),
    ],
    'Total Profit for Batch',
    formatMoney(batchProfit, currency),
    true // Amber styling for profit
  );

  docChildren.push(
    step4FormulaCard,
    new Paragraph({ spacing: { before: 180, after: 60 }, children: [] })
  );

  // 9. Section 5: Costing Summary Table
  docChildren.push(
    new Paragraph({
      heading: HeadingLevel.HEADING_2,
      spacing: { before: 180, after: 80 },
      children: [
        new TextRun({
          text: '5. Costing Summary',
          bold: true,
          size: 26,
          color: '0F172A',
        }),
      ],
    })
  );

  const summaryRows: [string, string, boolean, string?][] = [
    ['Total ingredient / direct cost', formatMoney(directCost, currency), false],
    ['Indirect cost (½ of ingredient cost)', formatMoney(indirectCost, currency), false],
    ['Total production cost', formatMoney(totalCost, currency), true, 'F1F5F9'],
    ['Number of servings / yield', String(servings), false],
    ['Unit cost per serving', formatRawMoney(unitCost, currency), false],
    ['Mark-up percentage', `${markupPercent}%`, false],
    ['Profit per serving', formatRawMoney(profitPerServing, currency, 5), false],
    ['Total profit for all servings', formatMoney(batchProfit, currency), true, 'FEF3C7'],
    ['Selling price per serving', formatMoney(roundedPrice, currency), true, 'FFF7ED'],
  ];

  const summaryTableRows = summaryRows.map(([label, value, isBold, fill]) => {
    return new TableRow({
      children: [
        new TableCell({
          borders: cellBorders,
          shading: fill ? { fill } : { fill: 'FAFAFA' },
          width: { size: 65, type: WidthType.PERCENTAGE },
          margins: { top: 60, bottom: 60, left: 80, right: 80 },
          children: [
            new Paragraph({
              children: [
                new TextRun({
                  text: label,
                  bold: isBold,
                  size: 20,
                  color: isBold && fill === 'FFF7ED' ? 'C2410C' : isBold && fill === 'FEF3C7' ? 'B45309' : '1E293B',
                }),
              ],
            }),
          ],
        }),
        new TableCell({
          borders: cellBorders,
          shading: fill ? { fill } : undefined,
          width: { size: 35, type: WidthType.PERCENTAGE },
          margins: { top: 60, bottom: 60, left: 80, right: 80 },
          children: [
            new Paragraph({
              alignment: AlignmentType.RIGHT,
              children: [
                new TextRun({
                  text: value,
                  bold: isBold,
                  size: isBold ? 22 : 20,
                  color: isBold && fill === 'FFF7ED' ? 'C2410C' : isBold && fill === 'FEF3C7' ? 'B45309' : '1E293B',
                }),
              ],
            }),
          ],
        }),
      ],
    });
  });

  docChildren.push(
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: summaryTableRows,
    })
  );

  // Sign-off signature section
  docChildren.push(
    new Paragraph({ spacing: { before: 240, after: 120 }, children: [] }),
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      borders: cellBordersNone,
      rows: [
        new TableRow({
          children: [
            new TableCell({
              width: { size: 50, type: WidthType.PERCENTAGE },
              borders: cellBordersNone,
              children: [
                new Paragraph({ children: [new TextRun({ text: 'Prepared by:', size: 20, color: '64748B' })] }),
                new Paragraph({ spacing: { before: 180 }, children: [new TextRun({ text: '_______________________________', size: 20 })] }),
                new Paragraph({ children: [new TextRun({ text: 'Student / Group Leader', size: 18, italics: true, color: '64748B' })] }),
              ],
            }),
            new TableCell({
              width: { size: 50, type: WidthType.PERCENTAGE },
              borders: cellBordersNone,
              children: [
                new Paragraph({ children: [new TextRun({ text: 'Evaluated & Approved by:', size: 20, color: '64748B' })] }),
                new Paragraph({ spacing: { before: 180 }, children: [new TextRun({ text: '_______________________________', size: 20 })] }),
                new Paragraph({ children: [new TextRun({ text: 'Instructor / Food Tech Teacher', size: 18, italics: true, color: '64748B' })] }),
              ],
            }),
          ],
        }),
      ],
    })
  );

  // Construct Document
  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: 720, // 0.5 in
              bottom: 720,
              left: 720,
              right: 720,
            },
          },
        },
        children: docChildren,
      },
    ],
  });

  // Pack buffer and route through Android-aware multi-tier saver
  const blob = await Packer.toBlob(doc);
  await saveOrShareFile({
    blob,
    fileName,
    mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    title: `${productName || 'Cooked Product'} Costing Worksheet`,
    text: `Costing and Pricing Worksheet for ${productName || 'Cooked Product'} (.docx format)`,
  });
}
