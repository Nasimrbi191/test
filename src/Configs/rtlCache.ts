import createCache from '@emotion/cache';
import stylisRTLPlugin from 'stylis-plugin-rtl';

const createEmotionCache = (isRtl: boolean) =>
  createCache({
    key: isRtl ? 'mui-rtl' : 'mui',
    stylisPlugins: isRtl ? [stylisRTLPlugin] : [],
  });

export default createEmotionCache;
