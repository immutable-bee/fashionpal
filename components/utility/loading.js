import React from 'react';
import { Loading, Grid } from "@nextui-org/react";

const LoadingComponent = ({ type = 'primarySpin', color = '#2EAAED', gradientHead, gradientTail, size = 'sm', noMargin = false }) => {

  const sizeMap = {
    xs: 'h-6 w-6',
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-12 w-12',
    xl: 'h-14 w-14',
  }

  const PrimarySpin = () => (
    <svg class={`${sizeMap[size]} ${noMargin ? 'my-0' : 'my-5'} mx-auto animate-spin`} viewBox="3 3 18 18">
      <path
        class="fill-sky-100"
        d="M12 5C8.13401 5 5 8.13401 5 12C5 15.866 8.13401 19 12 19C15.866 19 19 15.866 19 12C19 8.13401 15.866 5 12 5ZM3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12Z"></path>
      <path
        style={{ fill: color }}
        d="M16.9497 7.05015C14.2161 4.31648 9.78392 4.31648 7.05025 7.05015C6.65973 7.44067 6.02656 7.44067 5.63604 7.05015C5.24551 6.65962 5.24551 6.02646 5.63604 5.63593C9.15076 2.12121 14.8492 2.12121 18.364 5.63593C18.7545 6.02646 18.7545 6.65962 18.364 7.05015C17.9734 7.44067 17.3403 7.44067 16.9497 7.05015Z"></path>
    </svg>
  );

  const SecondarySpin = () => (
    <svg class={`${sizeMap[size]} ${noMargin ? 'my-0' : 'my-5'} mx-auto animate-spin`} style={{ stroke: color }} viewBox="0 0 256 256">
      <line x1="128" y1="32" x2="128" y2="64" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"></line>
      <line
        x1="195.9"
        y1="60.1"
        x2="173.3"
        y2="82.7"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="24"></line>
      <line x1="224" y1="128" x2="192" y2="128" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"></line>
      <line
        x1="195.9"
        y1="195.9"
        x2="173.3"
        y2="173.3"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="24"></line>
      <line x1="128" y1="224" x2="128" y2="192" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"></line>
      <line
        x1="60.1"
        y1="195.9"
        x2="82.7"
        y2="173.3"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="24"></line>
      <line x1="32" y1="128" x2="64" y2="128" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"></line>
      <line
        x1="60.1"
        y1="60.1"
        x2="82.7"
        y2="82.7"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="24"></line>
    </svg>
  );

  const getLoader = () => {
    switch (type) {
      case 'primarySpin':
        return <PrimarySpin />;
      case 'secondarySpin':
        return <SecondarySpin />;
      // case 'primarySpin':
      //   return <Loading type="default" size={size} color={color} className='' />;
      // case 'secondarySpin':
      //   return <Loading type="spinner" size={size} color={color} />;
      case 'secondaryPoints':
        return <Loading type="points" size={size} color={color} />;
      case 'primaryPoints':
        return <Loading type="points-opacity" size={size} color={color} />;
      case 'gradientSpin':
        return <Loading type="gradient" size={size} gradientBackground={`${gradientHead}, ${gradientTail}`} />;
      default:
        return <Loading type="default" size={size} color={color} />;
    }
  }

  return (
    <Grid>
      {getLoader()}
    </Grid>
  );
};

export default LoadingComponent;
