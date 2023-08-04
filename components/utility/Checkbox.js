import PropTypes from 'prop-types';

const CheckboxComponent = ({ isSelected, onChange, children, name, className, value, boolean = false, align }) => {
  const alignMap = {
    start: 'justify-start',
    center: 'justify-center',
    end: 'justify-end',
  }
  return (
    <div className={`${alignMap[align]} flex items-center`}>
      <input
        id={children}
        type="checkbox"
        name={name}
        value={value}
        checked={isSelected}
        onChange={(e) => onChange(boolean ? e : !isSelected)}
        className={`${className} w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500`}
      />
      <label
        htmlFor={children}
        className="ml-2 text-sm font-medium text-gray-700"
      >
        {children}
      </label>
    </div>
  );
};

CheckboxComponent.propTypes = {
  isSelected: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
  children: PropTypes.string.isRequired,
};

export default CheckboxComponent;
