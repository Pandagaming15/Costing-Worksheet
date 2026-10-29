export const GITHUB_REPO_STORAGE_KEY = 'food_costing_github_repo_v1';
export const DEFAULT_GITHUB_REPO = 'https://github.com/Pandagaming15/costing';

/**
 * Returns the current configured GitHub repository URL.
 */
export function getGitHubRepoUrl(): string {
  try {
    const saved = localStorage.getItem(GITHUB_REPO_STORAGE_KEY);
    if (saved && saved.trim().length > 0) {
      let formatted = saved.trim().replace(/\/+$/, '');
      if (!formatted.startsWith('http://') && !formatted.startsWith('https://')) {
        formatted = 'https://' + formatted;
      }
      return formatted;
    }
  } catch {
    // Ignore localStorage errors
  }
  return DEFAULT_GITHUB_REPO;
}

/**
 * Returns the GitHub releases URL.
 */
export function getGitHubReleasesUrl(): string {
  const base = getGitHubRepoUrl().replace(/\/+$/, '');
  return base.endsWith('/releases') ? base : `${base}/releases`;
}

/**
 * Returns the direct latest release URL.
 */
export function getGitHubLatestReleaseUrl(): string {
  const releases = getGitHubReleasesUrl();
  return `${releases}/latest`;
}

/**
 * Safely redirects the user to the GitHub Releases page.
 * Opens in a new tab if possible, with fallback to window.location.
 */
export function redirectToGitHubReleases(showToast?: (msg: string) => void): void {
  const url = getGitHubReleasesUrl();
  showToast?.('Redirecting to GitHub Releases...');
  try {
    const newWindow = window.open(url, '_blank', 'noopener,noreferrer');
    if (!newWindow || newWindow.closed || typeof newWindow.closed === 'undefined') {
      // Popup blocked, navigate directly
      window.location.href = url;
    }
  } catch {
    window.location.href = url;
  }
}

/**
 * Safely redirects the user to the latest release on GitHub.
 */
export function redirectToGitHubLatest(showToast?: (msg: string) => void): void {
  const url = getGitHubLatestReleaseUrl();
  showToast?.('Redirecting to latest release...');
  try {
    const newWindow = window.open(url, '_blank', 'noopener,noreferrer');
    if (!newWindow || newWindow.closed || typeof newWindow.closed === 'undefined') {
      window.location.href = url;
    }
  } catch {
    window.location.href = url;
  }
}
