import React, { useState } from 'react';

const ActivityForm = ({ activity, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: activity?.name || '',
    description: activity?.description || '',
    startTime: activity?.startTime || '',
    endTime: activity?.endTime || '',
    location: {
      name: activity?.location?.name || '',
      address: activity?.location?.address || '',
    },
    category: activity?.category || 'activity',
    notes: activity?.notes || '',
    cost: activity?.cost || 0,
    bookingUrl: activity?.bookingUrl || '',
    bookingReference: activity?.bookingReference || '',
  });

  const [errors, setErrors] = useState({});

  const categories = [
    { value: 'transport', label: '🚗 Transport', color: 'blue' },
    { value: 'accommodation', label: '🏨 Accommodation', color: 'green' },
    { value: 'food', label: '🍽️ Food & Dining', color: 'orange' },
    { value: 'activity', label: '🎯 Activity', color: 'purple' },
    { value: 'sightseeing', label: '🏛️ Sightseeing', color: 'indigo' },
    { value: 'other', label: '📌 Other', color: 'gray' }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: name === 'cost' ? parseFloat(value) || 0 : value
      }));
    }
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Activity name is required';
    }
    
    if (formData.startTime && formData.endTime) {
      if (formData.startTime >= formData.endTime) {
        newErrors.endTime = 'End time must be after start time';
      }
    }
    
    if (formData.cost < 0) {
      newErrors.cost = 'Cost cannot be negative';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    onSave(formData);
  };

  return (
    <div className="glass-card rounded-2xl p-4 sm:p-6 lg:p-8 relative overflow-hidden modal-mobile">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-blue-400/20 to-green-400/20 rounded-full blur-2xl"></div>
      
      <div className="relative z-10 mb-4 sm:mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-3">
          <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl flex items-center justify-center flex-shrink-0 mx-auto sm:mx-0">
            <span className="text-white text-xl">{activity ? '✏️' : '➕'}</span>
          </div>
          <div className="text-center sm:text-left">
            <h3 className="text-responsive-lg font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              {activity ? 'Edit Activity' : 'Add New Activity'}
            </h3>
            <p className="text-gray-600 text-sm sm:text-base">Fill in the details for your activity</p>
          </div>
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="relative z-10 space-y-6">
        {/* Activity Name */}
        <div>
          <label className="block text-sm font-bold text-gray-800 mb-2">
            Activity Name *
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={`input-field ${
              errors.name ? 'border-red-500 ring-red-300' : ''
            }`}
            placeholder="e.g., Visit Eiffel Tower"
          />
          {errors.name && (
            <div className="flex items-center gap-1 mt-2">
              <span className="text-red-500 text-sm">⚠️</span>
              <p className="text-red-600 text-sm font-medium">{errors.name}</p>
            </div>
          )}
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-bold text-gray-800 mb-2">
            Category
          </label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="select-field"
          >
            {categories.map((cat) => (
              <option key={cat.value} value={cat.value}>
                {cat.label}
              </option>
            ))}
          </select>
        </div>

        {/* Time inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          <div>
            <label className="block text-sm font-bold text-gray-800 mb-2">
              🕐 Start Time
            </label>
            <input
              type="time"
              name="startTime"
              value={formData.startTime}
              onChange={handleChange}
              className="input-field"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-800 mb-2">
              🕐 End Time
            </label>
            <input
              type="time"
              name="endTime"
              value={formData.endTime}
              onChange={handleChange}
              className={`input-field ${
                errors.endTime ? 'border-red-500 ring-red-300' : ''
              }`}
            />
            {errors.endTime && (
              <div className="flex items-center gap-1 mt-2">
                <span className="text-red-500 text-sm">⚠️</span>
                <p className="text-red-600 text-sm font-medium">{errors.endTime}</p>
              </div>
            )}
          </div>
        </div>

        {/* Location */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          <div>
            <label className="block text-sm font-bold text-gray-800 mb-2">
              📍 Location Name
            </label>
            <input
              type="text"
              name="location.name"
              value={formData.location.name}
              onChange={handleChange}
              className="input-field"
              placeholder="e.g., Eiffel Tower"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-800 mb-2">
              🗺️ Address
            </label>
            <input
              type="text"
              name="location.address"
              value={formData.location.address}
              onChange={handleChange}
              className="input-field"
              placeholder="e.g., Champ de Mars, Paris"
            />
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-bold text-gray-800 mb-2">
            📝 Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={3}
            className="textarea-field"
            placeholder="Describe this activity..."
          />
        </div>

        {/* Cost and Booking */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          <div>
            <label className="block text-sm font-bold text-gray-800 mb-2">
              💰 Cost (₹)
            </label>
            <input
              type="number"
              name="cost"
              value={formData.cost}
              onChange={handleChange}
              min="0"
              step="0.01"
              className={`input-field ${
                errors.cost ? 'border-red-500 ring-red-300' : ''
              }`}
              placeholder="0"
            />
            {errors.cost && (
              <div className="flex items-center gap-1 mt-2">
                <span className="text-red-500 text-sm">⚠️</span>
                <p className="text-red-600 text-sm font-medium">{errors.cost}</p>
              </div>
            )}
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-800 mb-2">
              🎫 Booking Reference
            </label>
            <input
              type="text"
              name="bookingReference"
              value={formData.bookingReference}
              onChange={handleChange}
              className="input-field"
              placeholder="e.g., ABC123"
            />
          </div>
        </div>

        {/* Booking URL */}
        <div>
          <label className="block text-sm font-bold text-gray-800 mb-2">
            🔗 Booking URL
          </label>
          <input
            type="url"
            name="bookingUrl"
            value={formData.bookingUrl}
            onChange={handleChange}
            className="input-field"
            placeholder="https://..."
          />
        </div>

        {/* Notes */}
        <div>
          <label className="block text-sm font-bold text-gray-800 mb-2">
            💭 Notes
          </label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows={3}
            className="textarea-field"
            placeholder="Any additional notes or reminders..."
          />
        </div>

        {/* Action Buttons - Mobile responsive */}
        <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4 pt-6 border-t border-white/20">
          <button
            type="button"
            onClick={onCancel}
            className="btn-secondary btn-mobile sm:w-auto order-2 sm:order-1"
          >
            ✕ Cancel
          </button>
          <button
            type="submit"
            className="btn-primary btn-mobile sm:w-auto order-1 sm:order-2"
          >
            {activity ? '✏️ Update Activity' : '➕ Add Activity'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ActivityForm;