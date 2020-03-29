import React from 'react';
import {useSelector} from 'react-redux';
import './index.scss';

const Tooltip = () => {
    const tooltip = useSelector(state => state.global.tooltip);

    if (!tooltip) return null;

    const {top, left, value, name, dt} = tooltip;

    const tooltipHeight = 250; // handle placement of tooltip

    return (
        <div className="content tooltip"
             style={{top: top - tooltipHeight < 0 ? top + tooltipHeight : top, left: left - 75}}>
            <div className="tooltip-container">
                <div className="contents">
                    <div className="inner-contents">
                        <div className="column">
                            <h5>{dt.format('MMM DD, YYYY @ hh a')}</h5>
                            <div className="title">{name}</div>
                            <div className="title">{`Wind Speed: ${value}`}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Tooltip;
