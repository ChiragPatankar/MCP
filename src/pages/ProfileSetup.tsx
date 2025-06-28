import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Plus, X, Upload, User } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const ProfileSetup: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
  const [mentorData, setMentorData] = useState({
    bio: '',
    experience: '',
    hourlyRate: '5',
    specialties: [] as string[],
    availableHours: [] as string[]
  });
  
  const [menteeData, setMenteeData] = useState({
    goals: '',
    interests: [] as string[],
    experience: 'beginner'
  });
  
  const [newSpecialty, setNewSpecialty] = useState('');
  const [newInterest, setNewInterest] = useState('');

  const specialtyOptions = [
    'Software Development', 'Product Management', 'Marketing', 'Sales', 'Design',
    'Data Science', 'Business Strategy', 'Leadership', 'Finance', 'Operations',
    'HR', 'Customer Success', 'DevOps', 'Security', 'Mobile Development'
  ];

  const timeSlots = [
    '9:00 AM - 10:00 AM', '10:00 AM - 11:00 AM', '11:00 AM - 12:00 PM',
    '12:00 PM - 1:00 PM', '1:00 PM - 2:00 PM', '2:00 PM - 3:00 PM',
    '3:00 PM - 4:00 PM', '4:00 PM - 5:00 PM', '5:00 PM - 6:00 PM'
  ];

  const addSpecialty = (specialty: string) => {
    if (specialty && !mentorData.specialties.includes(specialty)) {
      setMentorData(prev => ({
        ...prev,
        specialties: [...prev.specialties, specialty]
      }));
    }
    setNewSpecialty('');
  };

  const removeSpecialty = (specialty: string) => {
    setMentorData(prev => ({
      ...prev,
      specialties: prev.specialties.filter(s => s !== specialty)
    }));
  };

  const addInterest = (interest: string) => {
    if (interest && !menteeData.interests.includes(interest)) {
      setMenteeData(prev => ({
        ...prev,
        interests: [...prev.interests, interest]
      }));
    }
    setNewInterest('');
  };

  const removeInterest = (interest: string) => {
    setMenteeData(prev => ({
      ...prev,
      interests: prev.interests.filter(i => i !== interest)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setLoading(false);
    navigate('/dashboard');
  };

  if (!user) {
    navigate('/login');
    return null;
  }

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-primary-50 via-white to-secondary-50">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Complete Your Profile
          </h1>
          <p className="text-gray-600">
            {user.type === 'mentor' 
              ? 'Set up your mentor profile to start helping others'
              : 'Tell us about yourself to get better mentor matches'
            }
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Profile Photo */}
            <div className="text-center">
              <div className="relative inline-block">
                <div className="w-24 h-24 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <User className="h-12 w-12 text-white" />
                </div>
                <button
                  type="button"
                  className="absolute bottom-4 right-0 bg-white rounded-full p-2 shadow-lg border border-gray-200 hover:bg-gray-50"
                >
                  <Upload className="h-4 w-4 text-gray-600" />
                </button>
              </div>
              <p className="text-sm text-gray-600">Click to upload profile photo</p>
            </div>

            {user.type === 'mentor' ? (
              <>
                {/* Bio */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Professional Bio
                  </label>
                  <textarea
                    value={mentorData.bio}
                    onChange={(e) => setMentorData(prev => ({ ...prev, bio: e.target.value }))}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Tell mentees about your background, expertise, and what you can help with..."
                    required
                  />
                </div>

                {/* Experience */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Years of Experience
                  </label>
                  <input
                    type="text"
                    value={mentorData.experience}
                    onChange={(e) => setMentorData(prev => ({ ...prev, experience: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="e.g., 5+ years in software development"
                    required
                  />
                </div>

                {/* Rate */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rate per 5-minute session
                  </label>
                  <select
                    value={mentorData.hourlyRate}
                    onChange={(e) => setMentorData(prev => ({ ...prev, hourlyRate: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="2">$2</option>
                    <option value="3">$3</option>
                    <option value="4">$4</option>
                    <option value="5">$5</option>
                  </select>
                </div>

                {/* Specialties */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Specialties
                  </label>
                  <div className="space-y-3">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newSpecialty}
                        onChange={(e) => setNewSpecialty(e.target.value)}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="Add a specialty..."
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSpecialty(newSpecialty))}
                      />
                      <button
                        type="button"
                        onClick={() => addSpecialty(newSpecialty)}
                        className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                    
                    {/* Quick add buttons */}
                    <div className="flex flex-wrap gap-2">
                      {specialtyOptions.filter(s => !mentorData.specialties.includes(s)).slice(0, 6).map(specialty => (
                        <button
                          key={specialty}
                          type="button"
                          onClick={() => addSpecialty(specialty)}
                          className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200"
                        >
                          + {specialty}
                        </button>
                      ))}
                    </div>
                    
                    {/* Selected specialties */}
                    {mentorData.specialties.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {mentorData.specialties.map(specialty => (
                          <span
                            key={specialty}
                            className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-primary-100 text-primary-800"
                          >
                            {specialty}
                            <button
                              type="button"
                              onClick={() => removeSpecialty(specialty)}
                              className="ml-2 hover:text-primary-900"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Available Hours */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Available Time Slots (optional)
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {timeSlots.map(slot => (
                      <label key={slot} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={mentorData.availableHours.includes(slot)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setMentorData(prev => ({
                                ...prev,
                                availableHours: [...prev.availableHours, slot]
                              }));
                            } else {
                              setMentorData(prev => ({
                                ...prev,
                                availableHours: prev.availableHours.filter(h => h !== slot)
                              }));
                            }
                          }}
                          className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                        />
                        <span className="text-sm text-gray-700">{slot}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <>
                {/* Goals */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    What are your goals?
                  </label>
                  <textarea
                    value={menteeData.goals}
                    onChange={(e) => setMenteeData(prev => ({ ...prev, goals: e.target.value }))}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Tell us what you want to achieve and how mentors can help you..."
                    required
                  />
                </div>

                {/* Experience Level */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Experience Level
                  </label>
                  <select
                    value={menteeData.experience}
                    onChange={(e) => setMenteeData(prev => ({ ...prev, experience: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>

                {/* Interests */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Areas of Interest
                  </label>
                  <div className="space-y-3">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newInterest}
                        onChange={(e) => setNewInterest(e.target.value)}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="Add an interest..."
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addInterest(newInterest))}
                      />
                      <button
                        type="button"
                        onClick={() => addInterest(newInterest)}
                        className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                    
                    {/* Quick add buttons */}
                    <div className="flex flex-wrap gap-2">
                      {specialtyOptions.filter(s => !menteeData.interests.includes(s)).slice(0, 6).map(interest => (
                        <button
                          key={interest}
                          type="button"
                          onClick={() => addInterest(interest)}
                          className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200"
                        >
                          + {interest}
                        </button>
                      ))}
                    </div>
                    
                    {/* Selected interests */}
                    {menteeData.interests.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {menteeData.interests.map(interest => (
                          <span
                            key={interest}
                            className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-primary-100 text-primary-800"
                          >
                            {interest}
                            <button
                              type="button"
                              onClick={() => removeInterest(interest)}
                              className="ml-2 hover:text-primary-900"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-primary-500 to-secondary-500 text-white py-3 px-4 rounded-lg font-semibold hover:from-primary-600 hover:to-secondary-600 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                <>
                  <span>Complete Profile</span>
                  <ArrowRight className="h-5 w-5" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfileSetup;