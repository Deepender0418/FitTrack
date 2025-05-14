import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  User, 
  Mail, 
  Calendar, 
  Edit3, 
  Save,
  Award,
  CheckCircle2,
  Clock,
  Scale,
  Ruler,
  Heart
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

interface UserProfile {
  name: string;
  email: string;
  joinDate: string;
  stats: {
    workoutsCompleted: number;
    goalsAchieved: number;
    longestStreak: number;
    totalMinutes: number;
  };
  measurements: {
    weight: number;
    height: number;
    restingHeartRate: number;
  };
  preferences: {
    weightUnit: 'kg' | 'lbs';
    heightUnit: 'cm' | 'ft';
    notificationsEnabled: boolean;
  };
}

const Profile = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<any>({});

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get('/users/profile');
        setProfile(response.data);
        setFormData({
          name: response.data.name,
          email: response.data.email,
          weight: response.data.measurements.weight,
          height: response.data.measurements.height,
          restingHeartRate: response.data.measurements.restingHeartRate,
          weightUnit: response.data.preferences.weightUnit,
          heightUnit: response.data.preferences.heightUnit,
          notificationsEnabled: response.data.preferences.notificationsEnabled
        });
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user]);

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await api.put('/users/profile', formData);
      setProfile(response.data);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <motion.div
          className="w-12 h-12 border-4 border-blue-200 rounded-full"
          style={{ borderTopColor: '#3B82F6' }}
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        />
      </div>
    );
  }

  if (!profile) {
    return <div>Error loading profile</div>;
  }

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Your Profile</h1>
        <p className="text-gray-600 mt-1">Manage your personal information and preferences</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main profile info */}
        <motion.div
          className="card lg:col-span-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Personal Information</h2>
            <button
              className="btn-outline py-1 px-3 flex items-center"
              onClick={handleEditToggle}
            >
              {isEditing ? (
                <>
                  <Save size={16} className="mr-1" />
                  Cancel
                </>
              ) : (
                <>
                  <Edit3 size={16} className="mr-1" />
                  Edit
                </>
              )}
            </button>
          </div>

          {isEditing ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="form-group">
                  <label htmlFor="name" className="label">Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="input"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email" className="label">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="input"
                    required
                  />
                </div>
              </div>

              <h3 className="font-medium text-gray-900 mt-6 mb-3">Body Measurements</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="form-group">
                  <label htmlFor="weight" className="label">Weight</label>
                  <div className="flex">
                    <input
                      type="number"
                      id="weight"
                      name="weight"
                      value={formData.weight}
                      onChange={handleChange}
                      className="input rounded-r-none flex-1"
                      step="0.1"
                      required
                    />
                    <select
                      name="weightUnit"
                      value={formData.weightUnit}
                      onChange={handleChange}
                      className="input rounded-l-none w-20 border-l-0"
                    >
                      <option value="lbs">lbs</option>
                      <option value="kg">kg</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="height" className="label">Height</label>
                  <div className="flex">
                    <input
                      type="number"
                      id="height"
                      name="height"
                      value={formData.height}
                      onChange={handleChange}
                      className="input rounded-r-none flex-1"
                      step="0.1"
                      required
                    />
                    <select
                      name="heightUnit"
                      value={formData.heightUnit}
                      onChange={handleChange}
                      className="input rounded-l-none w-20 border-l-0"
                    >
                      <option value="cm">cm</option>
                      <option value="ft">ft</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="restingHeartRate" className="label">Resting Heart Rate</label>
                  <div className="flex">
                    <input
                      type="number"
                      id="restingHeartRate"
                      name="restingHeartRate"
                      value={formData.restingHeartRate}
                      onChange={handleChange}
                      className="input rounded-r-none flex-1"
                      required
                    />
                    <span className="inline-flex items-center px-3 rounded-r-md border border-l-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                      bpm
                    </span>
                  </div>
                </div>
              </div>

              <h3 className="font-medium text-gray-900 mt-6 mb-3">Preferences</h3>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="notificationsEnabled"
                  name="notificationsEnabled"
                  checked={formData.notificationsEnabled}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="notificationsEnabled" className="ml-2 text-sm text-gray-700">
                  Enable notifications for workout reminders and goal updates
                </label>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={handleEditToggle}
                  className="btn-outline"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                >
                  <Save size={16} className="mr-1" />
                  Save Changes
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center">
                  <div className="bg-blue-100 p-3 rounded-lg mr-4">
                    <User size={24} className="text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Name</p>
                    <p className="font-medium">{profile.name}</p>
                  </div>
                </div>

                <div className="flex items-center">
                  <div className="bg-blue-100 p-3 rounded-lg mr-4">
                    <Mail size={24} className="text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium">{profile.email}</p>
                  </div>
                </div>

                <div className="flex items-center">
                  <div className="bg-blue-100 p-3 rounded-lg mr-4">
                    <Calendar size={24} className="text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Member Since</p>
                    <p className="font-medium">{formatDate(profile.joinDate)}</p>
                  </div>
                </div>
              </div>

              <div className="border-t pt-6">
                <h3 className="font-medium text-gray-900 mb-4">Body Measurements</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center">
                    <div className="bg-emerald-100 p-2 rounded-lg mr-3">
                      <Scale size={20} className="text-emerald-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Weight</p>
                      <p className="font-medium">
                        {profile.measurements.weight} {profile.preferences.weightUnit}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <div className="bg-emerald-100 p-2 rounded-lg mr-3">
                      <Ruler size={20} className="text-emerald-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Height</p>
                      <p className="font-medium">
                        {profile.measurements.height} {profile.preferences.heightUnit}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <div className="bg-emerald-100 p-2 rounded-lg mr-3">
                      <Heart size={20} className="text-emerald-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Resting Heart Rate</p>
                      <p className="font-medium">{profile.measurements.restingHeartRate} bpm</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t pt-6">
                <h3 className="font-medium text-gray-900 mb-4">Preferences</h3>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={profile.preferences.notificationsEnabled}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    readOnly
                    disabled
                  />
                  <span className="ml-2 text-gray-700">
                    {profile.preferences.notificationsEnabled
                      ? 'Notifications are enabled'
                      : 'Notifications are disabled'}
                  </span>
                </div>
              </div>
            </div>
          )}
        </motion.div>

        {/* Stats */}
        <motion.div
          className="card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Your Stats</h2>
          
          <div className="space-y-5">
            <div className="flex items-center">
              <div className="bg-orange-100 p-3 rounded-lg mr-4">
                <CheckCircle2 size={24} className="text-orange-600" />
              </div>
              <div>
                <p className="text-gray-500 text-sm">Workouts Completed</p>
                <p className="text-xl font-bold">{profile.stats.workoutsCompleted}</p>
              </div>
            </div>

            <div className="flex items-center">
              <div className="bg-green-100 p-3 rounded-lg mr-4">
                <Award size={24} className="text-green-600" />
              </div>
              <div>
                <p className="text-gray-500 text-sm">Goals Achieved</p>
                <p className="text-xl font-bold">{profile.stats.goalsAchieved}</p>
              </div>
            </div>

            <div className="flex items-center">
              <div className="bg-blue-100 p-3 rounded-lg mr-4">
                <Calendar size={24} className="text-blue-600" />
              </div>
              <div>
                <p className="text-gray-500 text-sm">Longest Streak</p>
                <p className="text-xl font-bold">{profile.stats.longestStreak} days</p>
              </div>
            </div>

            <div className="flex items-center">
              <div className="bg-purple-100 p-3 rounded-lg mr-4">
                <Clock size={24} className="text-purple-600" />
              </div>
              <div>
                <p className="text-gray-500 text-sm">Total Workout Time</p>
                <p className="text-xl font-bold">{profile.stats.totalMinutes} mins</p>
              </div>
            </div>
          </div>

          {/* <div className="mt-8 pt-6 border-t">
            <h3 className="font-medium text-gray-900 mb-4">Connected Accounts</h3>
            <div className="space-y-3">
              <button className="w-full btn-outline flex items-center justify-center">
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="#4285F4" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 0C5.372 0 0 5.372 0 12C0 18.628 5.372 24 12 24C18.628 24 24 18.628 24 12C24 5.372 18.628 0 12 0Z" fill="#4285F4"/>
                  <path d="M16.939 12C16.939 11.539 16.897 11.097 16.817 10.674H12V13.026H14.829C14.683 13.826 14.172 14.505 13.405 14.951V16.574H15.424C16.716 15.368 17.45 13.812 17.45 12H16.939Z" fill="#3E75C3"/>
                  <path d="M12.0001 17.9999C13.7001 17.9999 15.1211 17.3749 16.1621 16.3359L14.1431 14.7129C13.5551 15.1129 12.8251 15.3549 12.0001 15.3549C10.2991 15.3549 8.85915 14.1929 8.34215 12.6299H6.25415V14.3099C7.29215 16.4999 9.47315 17.9999 12.0001 17.9999Z" fill="#34A853"/>
                  <path d="M8.34 12.6301C8.06 11.9601 7.95 11.2261 8.07 10.5011C8.02 9.9001 8.14 9.3001 8.42 8.7701L6.33 7.0901C5.64 8.5601 5.50 10.2301 5.95 11.7901C6.41 13.3501 7.42 14.6901 8.78 15.6001L10.87 13.9201C9.99 13.6201 9.23 13.0301 8.78 12.2401L8.34 12.6301Z" fill="#FBBC05"/>
                  <path d="M12.0001 8.58008C12.8501 8.58008 13.6711 8.88008 14.2921 9.50008L16.0861 7.70608C14.9751 6.60608 13.5171 6.00008 12.0001 6.00008C9.47315 6.00008 7.29215 7.50008 6.25415 9.69008L8.34215 11.3701C8.85915 9.80708 10.2991 8.64508 12.0001 8.64508V8.58008Z" fill="#EA4335"/>
                </svg>
                Connect Google Fit
              </button>
              
              <button className="w-full btn-outline flex items-center justify-center">
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="#0084FE" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 0C5.373 0 0 5.373 0 12C0 18.627 5.373 24 12 24C18.627 24 24 18.627 24 12C24 5.373 18.627 0 12 0Z" fill="#0084FE"/>
                  <path d="M15.75 7.5H8.25C7.836 7.5 7.5 7.836 7.5 8.25V15.75C7.5 16.164 7.836 16.5 8.25 16.5H15.75C16.164 16.5 16.5 16.164 16.5 15.75V8.25C16.5 7.836 16.164 7.5 15.75 7.5Z" fill="white"/>
                  <path d="M12 10.5C11.172 10.5 10.5 11.172 10.5 12C10.5 12.828 11.172 13.5 12 13.5C12.828 13.5 13.5 12.828 13.5 12C13.5 11.172 12.828 10.5 12 10.5Z" fill="#0084FE"/>
                </svg>
                Connect Apple Health
              </button>
            </div>
          </div> */}
        </motion.div>
      </div>
    </div>
  );
};

export default Profile;