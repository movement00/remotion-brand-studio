import { loadFont as loadPoppins } from '@remotion/google-fonts/Poppins';
import { loadFont as loadInter } from '@remotion/google-fonts/Inter';
import { loadFont as loadMontserrat } from '@remotion/google-fonts/Montserrat';
import { loadFont as loadOpenSans } from '@remotion/google-fonts/OpenSans';
import { loadFont as loadRoboto } from '@remotion/google-fonts/Roboto';
import { loadFont as loadRaleway } from '@remotion/google-fonts/Raleway';
import { loadFont as loadPlayfairDisplay } from '@remotion/google-fonts/PlayfairDisplay';
import { loadFont as loadOswald } from '@remotion/google-fonts/Oswald';
import { loadFont as loadLato } from '@remotion/google-fonts/Lato';
import { loadFont as loadNunito } from '@remotion/google-fonts/Nunito';
import { loadFont as loadQuicksand } from '@remotion/google-fonts/Quicksand';
import { loadFont as loadRubik } from '@remotion/google-fonts/Rubik';
import { loadFont as loadMulish } from '@remotion/google-fonts/Mulish';
import { loadFont as loadBarlow } from '@remotion/google-fonts/Barlow';

const fontLoaders: Record<string, () => { fontFamily: string }> = {
  Poppins: () => loadPoppins(),
  Inter: () => loadInter(),
  Montserrat: () => loadMontserrat(),
  'Open Sans': () => loadOpenSans(),
  Roboto: () => loadRoboto(),
  Raleway: () => loadRaleway(),
  'Playfair Display': () => loadPlayfairDisplay(),
  Oswald: () => loadOswald(),
  Lato: () => loadLato(),
  Nunito: () => loadNunito(),
  Quicksand: () => loadQuicksand(),
  Rubik: () => loadRubik(),
  Mulish: () => loadMulish(),
  Barlow: () => loadBarlow(),
};

const loadedFonts: Record<string, string> = {};

export function getFont(fontName: string): string {
  if (loadedFonts[fontName]) return loadedFonts[fontName];

  const loader = fontLoaders[fontName];
  if (loader) {
    const { fontFamily } = loader();
    loadedFonts[fontName] = fontFamily;
    return fontFamily;
  }

  // Fallback
  return fontName;
}

export function loadBrandFonts(heading: string, body: string): { heading: string; body: string } {
  return {
    heading: getFont(heading),
    body: getFont(body),
  };
}
