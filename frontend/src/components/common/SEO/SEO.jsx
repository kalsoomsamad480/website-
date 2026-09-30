import { useEffect } from 'react';

const SITE = 'Alladin Cafe';
const DEFAULT_TITLE = 'Alladin Cafe | Coffee and Study Space';

function setMeta(selector, content) {
  document.querySelector(selector)?.setAttribute('content', content);
}

/** Sets the page title, description, and social preview text for the current route. */
function SEO({ title, description, noIndex = false }) {
  useEffect(() => {
    const fullTitle = title ? `${title} | ${SITE}` : DEFAULT_TITLE;
    document.title = fullTitle;
    setMeta('meta[property="og:title"]', fullTitle);
    setMeta('meta[name="twitter:title"]', fullTitle);

    if (description) {
      setMeta('meta[name="description"]', description);
      setMeta('meta[property="og:description"]', description);
      setMeta('meta[name="twitter:description"]', description);
    }
    setMeta('meta[name="robots"]', noIndex ? 'noindex, nofollow' : 'index, follow');
  }, [title, description, noIndex]);

  return null;
}

export default SEO;
