import { useSectionContext } from "../components/pages/Home/Section";

/**
 * Hook aman untuk dipakai di luar SectionContext.
 * Tidak akan error meskipun context tidak tersedia.
 */
export const useSafeSectionContext = () => {
  try {
    return useSectionContext();
  } catch (err) {
    return { isOdd: false };
  }
};
