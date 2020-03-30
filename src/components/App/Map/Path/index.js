import React, { useRef, useCallback, useState } from 'react';
import { useDispatch } from 'react-redux';
import { UPDATE_TOOLTIP } from '../../../../redux/modules/global';
import clsx from 'clsx';

const Path = ({ feature, className }) => {
  const dispatch = useDispatch();
  const pathRef = useRef(null);
  const [active, setActive] = useState(false);
  const [selected, setSelected] = useState(false);
  const { properties, path, id, fill, dt, value } = feature;

  const setTooltip = useCallback(item => dispatch({ type: UPDATE_TOOLTIP, item }), [dispatch]);

  const onMouseOver = () => {
    const { top, left } = pathRef.current.getBoundingClientRect();
    setTooltip({
      id,
      name: properties.name,
      dt,
      top: top - 10,
      left,
      value,
      isClicked: false,
    });
    setActive(!active);
  };

  const onClick = () => {
    const { top, left } = pathRef.current.getBoundingClientRect();
    setTooltip({
      id,
      name: properties.name,
      dt,
      top: top - 10,
      left,
      value,
      isClicked: true,
    });
    setSelected(!selected);
  };

  return (
    <path
      ref={pathRef}
      d={path}
      className={clsx(className, selected || active ? 'active' : '')}
      style={{ fill }}
      onClick={onClick}
      onMouseOver={onMouseOver}
      onMouseOut={() => {
        setTooltip(null);
        setActive(!active);
      }}
    />
  );
};

export default Path;
