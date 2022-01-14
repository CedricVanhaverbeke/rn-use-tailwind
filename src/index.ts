import { useCallback } from 'react';
import { useWindowDimensions } from 'react-native';
import tw from 'tailwind-rn';

const SCREENS_PREFIX: Record<string, string> = {
  640: 'sm:',
  768: 'md:',
  1024: 'lg:',
  1280: 'xl:',
  1536: '2xl:',
};

const SCREENS = Object.keys(SCREENS_PREFIX);

const NO_SCREEN_PREFIX_REGEX = /^(?!.+:).*/;

export const filterScreenWidth = (classNames: string, screenWidth: number) => {
  const classNamesArray = classNames.split(/\s+/);
  let output = [];

  // loop through all sizes and apply styles when they reach a certain width
  // we can stop early if a style cannot be reached
  for (let i = 0; i < SCREENS.length; i++) {
    if (screenWidth < Number(SCREENS[i])) {
      break;
    }

    output.push(
      classNamesArray.map(val =>
        val.startsWith(SCREENS_PREFIX[SCREENS[i]])
          ? val.replace(SCREENS_PREFIX[SCREENS[i]], '')
          : undefined
      )
    );
  }

  // add the regular styles in front
  output.unshift(
    classNamesArray.filter(val => NO_SCREEN_PREFIX_REGEX.test(val))
  );

  return tw(
    output
      .flat()
      .filter(Boolean)
      .join(' ')
  );
};

const useTailwind = () => {
  const { width } = useWindowDimensions();

  const tw = useCallback(
    (classNames: string) => filterScreenWidth(classNames, width),
    [filterScreenWidth, width]
  );

  return tw;
};

export default useTailwind;
