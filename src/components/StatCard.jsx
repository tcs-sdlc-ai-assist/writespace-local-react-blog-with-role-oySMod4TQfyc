import PropTypes from 'prop-types';

/**
 * Admin dashboard statistics card component.
 * Displays a numeric value with a label and an icon/emoji on a colorful background.
 *
 * @param {Object} props
 * @param {number|string} props.value - The statistic value to display.
 * @param {string} props.label - The label describing the statistic.
 * @param {string} props.icon - An emoji or text character to display as the icon.
 * @param {string} [props.bgColor='bg-primary-100'] - Tailwind background color class for the icon container.
 * @param {string} [props.textColor='text-primary-600'] - Tailwind text color class for the icon.
 */
export function StatCard({ value, label, icon, bgColor = 'bg-primary-100', textColor = 'text-primary-600' }) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow">
      <div className="flex items-center space-x-4">
        <div
          className={`inline-flex items-center justify-center w-12 h-12 rounded-lg ${bgColor} ${textColor} text-xl flex-shrink-0`}
        >
          {icon}
        </div>
        <div>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          <p className="text-sm font-medium text-gray-500">{label}</p>
        </div>
      </div>
    </div>
  );
}

StatCard.propTypes = {
  value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  label: PropTypes.string.isRequired,
  icon: PropTypes.string.isRequired,
  bgColor: PropTypes.string,
  textColor: PropTypes.string,
};

export default StatCard;