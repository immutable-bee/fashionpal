import React from 'react';

const InputField = ({
  labelPlaceholder,
  name,
  onChange,
  required,
  type,
  placeholder,
  contentLeft,
  className,
  value,
  min,
  max,
  step,
  onBlur,
  labelLeft,
  labelRight,
  pattern,
  initialValue
}) => {
  return (
    <div className={`relative flex items-center cursor-pointer w-full`}>
      {contentLeft && <div className='absolute left-3 mr-2 '>{contentLeft}</div>}
      {labelLeft && <span className='absolute left-3 mr-2'>{labelLeft}</span>}
      <input
        required={required}
        name={name}
        type={type}
        value={value ? initialValue : value}
        min={min}
        max={max}
        step={step}
        pattern={pattern}
        placeholder={labelPlaceholder ? labelPlaceholder : placeholder}
        className={`${className} h-11 my-1 border-2 rounded-xl w-full px-3 text-sm bg-white border-opacity-50 !placeholder-gray-400   outline-none focus:border-blue-500  transition duration-200 ${contentLeft && 'pl-10'}`}
        onChange={onChange}
        onBlur={onBlur}
      />
      {labelRight && <span className='absolute right-3 ml-2'>{labelRight}</span>}
    </div>
  )
}

export default InputField;
