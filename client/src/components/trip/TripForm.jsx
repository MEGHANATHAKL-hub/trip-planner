import React, { useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { tripAPI } from '../../utils/api';

const TripForm = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: '',
      description: '',
      destination: '',
      startDate: '',
      endDate: '',
      budget: '',
      activities: [{ value: '' }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'activities',
  });

  useEffect(() => {
    if (isEdit) {
      loadTrip();
    }
  }, [id, isEdit]);

  const loadTrip = async () => {
    try {
      setLoading(true);
      const response = await tripAPI.getTripById(id);
      const trip = response.data;
      
      setValue('title', trip.title);
      setValue('description', trip.description || '');
      setValue('destination', trip.destination);
      setValue('startDate', trip.startDate.split('T')[0]);
      setValue('endDate', trip.endDate.split('T')[0]);
      setValue('budget', trip.budget || '');
      
      if (trip.activities && trip.activities.length > 0) {
        setValue('activities', trip.activities.map(activity => ({ value: activity })));
      }
    } catch (error) {
      setError('Failed to load trip');
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data) => {
    setLoading(true);
    setError('');

    try {
      const tripData = {
        ...data,
        activities: data.activities.map(activity => activity.value).filter(Boolean),
        budget: data.budget ? parseFloat(data.budget) : 0,
      };

      if (isEdit) {
        await tripAPI.updateTrip(id, tripData);
      } else {
        await tripAPI.createTrip(tripData);
      }

      navigate('/dashboard');
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to save trip');
    } finally {
      setLoading(false);
    }
  };

  if (loading && isEdit) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        {isEdit ? 'Edit Trip' : 'Create New Trip'}
      </h1>

      <div className="card">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
              Trip Title *
            </label>
            <input
              {...register('title', {
                required: 'Trip title is required',
                maxLength: { value: 100, message: 'Title cannot exceed 100 characters' },
              })}
              type="text"
              className="input-field mt-1"
              placeholder="Enter trip title"
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="destination" className="block text-sm font-medium text-gray-700">
              Destination *
            </label>
            <input
              {...register('destination', {
                required: 'Destination is required',
                maxLength: { value: 100, message: 'Destination cannot exceed 100 characters' },
              })}
              type="text"
              className="input-field mt-1"
              placeholder="Enter destination"
            />
            {errors.destination && (
              <p className="mt-1 text-sm text-red-600">{errors.destination.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
                Start Date *
              </label>
              <input
                {...register('startDate', {
                  required: 'Start date is required',
                })}
                type="date"
                className="input-field mt-1"
              />
              {errors.startDate && (
                <p className="mt-1 text-sm text-red-600">{errors.startDate.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">
                End Date *
              </label>
              <input
                {...register('endDate', {
                  required: 'End date is required',
                })}
                type="date"
                className="input-field mt-1"
              />
              {errors.endDate && (
                <p className="mt-1 text-sm text-red-600">{errors.endDate.message}</p>
              )}
            </div>
          </div>

          <div>
            <label htmlFor="budget" className="block text-sm font-medium text-gray-700">
              Budget (optional)
            </label>
            <input
              {...register('budget', {
                pattern: {
                  value: /^\d+(\.\d{2})?$/,
                  message: 'Please enter a valid amount',
                },
              })}
              type="number"
              step="0.01"
              min="0"
              className="input-field mt-1"
              placeholder="Enter budget amount"
            />
            {errors.budget && (
              <p className="mt-1 text-sm text-red-600">{errors.budget.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Description (optional)
            </label>
            <textarea
              {...register('description', {
                maxLength: { value: 1000, message: 'Description cannot exceed 1000 characters' },
              })}
              rows="4"
              className="input-field mt-1"
              placeholder="Enter trip description"
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Activities (optional)
            </label>
            {fields.map((field, index) => (
              <div key={field.id} className="flex items-center space-x-2 mb-2">
                <input
                  {...register(`activities.${index}.value`, {
                    maxLength: { value: 200, message: 'Activity cannot exceed 200 characters' },
                  })}
                  type="text"
                  className="input-field flex-1"
                  placeholder="Enter activity"
                />
                {index > 0 && (
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={() => append({ value: '' })}
              className="btn-secondary text-sm"
            >
              Add Activity
            </button>
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary"
            >
              {loading ? 'Saving...' : isEdit ? 'Update Trip' : 'Create Trip'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TripForm;