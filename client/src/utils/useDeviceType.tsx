import { useState, useEffect } from 'react';

const getWindowDimensions = () => {
  const { innerWidth: width, innerHeight: height } = window;
  return {
    width,
    height,
  };
};

const identifyType = (width: number) => {
  switch (true) {
    case width < 576:
      return 'mobile';
    case width < 1024:
      return 'tablet';
    default:
      return 'desktop';
  }
};

const isMobile = (type: DeviceType) => type === 'mobile';
const isTablet = (type: DeviceType) => type === 'tablet';
const isDesktop = (type: DeviceType) => type === 'desktop';

const useDeviceType = (): DeviceType => {
  const [windowDimensions, setWindowDimensions] = useState<{ width: number; height: number }>(getWindowDimensions());

  useEffect(() => {
    const handleResize = () => {
      setWindowDimensions(getWindowDimensions());
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return identifyType(windowDimensions.width);
};

type DeviceType = 'mobile' | 'tablet' | 'desktop';

export type { DeviceType };
export { useDeviceType, isMobile, isTablet, isDesktop };
