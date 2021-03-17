import { useState, memo } from 'react'
import { Slider } from 'antd'

const CustomSlider =  ({ radius = 1 }) =>  (
    <Slider
        min={0.5}
        max={20}
        onChange={kmSliderRadius}
        onAfterChange={kmSliderSearch}
        value={radius}
        step={0.5}
        tipFormatter={(value) => `${value}km`}
    />
);

export default memo(CustomSlider);