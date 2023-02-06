import { DeviceType } from './useDeviceType';

const BTN_CLASS_SM = 'btn-sm';
const BTN_CLASS_MD = 'btn-md';
const BTN_CLASS_LG = 'btn-lg';

const getButtonSizeClass = (deviceType: DeviceType): string => {
  switch (deviceType) {
    case 'mobile':
      return BTN_CLASS_SM;
    case 'tablet':
      return BTN_CLASS_MD;
    default:
      return BTN_CLASS_LG;
  }
};

export { getButtonSizeClass };
