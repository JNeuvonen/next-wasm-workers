import React, { useEffect, useState } from 'react';
import Tooltip from '@mui/material/Tooltip';
const TooltipWrapper = ({
  title,
  content,
}: {
  title: JSX.Element | String;
  content: JSX.Element;
}) => {
  return <Tooltip title={title}>{content}</Tooltip>;
};
export default TooltipWrapper;
