import PropTypes from 'prop-types';
import Image from 'next/image';

function ButtonComponent({ children, onClick, icon, id, className = '', rounded = false, color = 'yellow', full = false, align = 'center', padding = 'normal', border = true, disabled = false, onlyIcon = false }) {
  const colorMap = {
    blue: 'bg-sky-500 text-white',
    yellow: 'bg-yellow-500 text-black border border-black',
    white: 'bg-white text-black',
    gray: 'bg-[#e6dddd] text-black',
    red: 'bg-red-500 text-white border border-black',
  };
  const alignMap = {
    start: 'justify-start',
    center: 'justify-center',
    end: 'justify-end',
  }

  const paddingMap = {
    normal: 'py-2.5 px-3',
    no: 'p-0',
    small: 'py-1.5 px-1.5',
  }

  return (

    <button
      id={id}
      className={`flex items-center my-1 text-sm font-normal
        ${rounded ? 'rounded-full' : ''}
        ${full ? 'w-full' : ''}
        ${border ? 'border border-black' : ''}
        ${colorMap[color]}
        ${paddingMap[padding]}
        ${disabled ? 'opacity-70 pointer-events-none' : ''}
        ${onlyIcon ? 'rounded-xl h-8 w-9 ml-3' : ''}
        ${className} ${alignMap[align]}`}
      onClick={onClick}
    >
      {icon}
      {children}
    </button>
  );
}

ButtonComponent.propTypes = {
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func,
  icon: PropTypes.node,
  id: PropTypes.string,
  className: PropTypes.string,
  rounded: PropTypes.bool,
  color: PropTypes.string,
  full: PropTypes.bool,
};

export default ButtonComponent;
