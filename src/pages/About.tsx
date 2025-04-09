import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Search } from 'lucide-react';
import { ChevronUp, ChevronDown } from 'lucide-react';

interface Member {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  block_number: string;
  is_executive: boolean;
  photo_url?: string;
}

const PAGE_SIZE = 10;

function About() {
  const [members, setMembers] = useState<Member[]>([]);
  const [executives, setExecutives] = useState<Member[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState<Error | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [sortField, setSortField] = useState('full_name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [newMember, setNewMember] = useState<Member>({
    id: '',
    full_name: '',
    email: '',
    phone: '',
    block_number: '',
    is_executive: false,
  });
  const [showForm, setShowForm] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSession = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) {
        console.error('Error fetching session:', error);
        setLoading(false);
      } else {
        setUser(session?.user || null);
        if (session?.user) {
          const { data: userData, error: roleError } = await supabase
            .from('members')
            .select('role')
            .eq('email', session.user.email)
            .single();

          if (roleError) {
            console.error('Error fetching user role:', roleError);
          } else {
            setUserRole(userData?.role || null);
          }
        }
        setLoading(false);
      }
    };

    fetchSession();

    const { data: authListener } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user || null);
      setLoading(false);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const fetchMembers = async () => {
    if (!user) {
      console.error('User not authenticated');
      return;
    }

    try {
      const { data: allMembers, error, count } = await supabase
        .from('members')
        .select('*', { count: 'exact' })
        .order(sortField, { ascending: sortOrder === 'asc' });

      if (error) {
        console.error('Error fetching members:', error);
        setError(error);
      } else {
        console.log('Fetched members data:', allMembers);
        if (allMembers) {
          const uniqueMembers = Array.from(new Map(allMembers.map(member => [member.id, member])).values());
          
          // Ensure each member has a unique photo_url
          const membersWithPhotos = uniqueMembers.map(member => ({
            ...member,
            photo_url: member.photo || 'NA',
          }));

          setMembers(membersWithPhotos);
          setExecutives(membersWithPhotos.filter(member => member.is_executive));
          console.log('Members state after setting:', membersWithPhotos);
          setTotalPages(Math.ceil((count || 0) / PAGE_SIZE));
        }
      }
    } catch (error) {
      console.error('Error fetching members:', error);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, [user, sortField, sortOrder]);

  const handleSort = (field: string) => {
    setSortField(field);
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const filteredMembers = members.filter(member =>
    member.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.block_number.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate total pages based on filtered members
  const totalFilteredPages = Math.ceil(filteredMembers.length / PAGE_SIZE);

  // Paginate the filtered members
  const paginatedMembers = filteredMembers.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewMember((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const { full_name, email, phone, block_number, is_executive } = newMember;

    if (!full_name || !email || !phone || !block_number) {
      console.error('All fields are required');
      return;
    }

    if (!user) {
      console.error('User not authenticated');
      return;
    }

    const { error } = await supabase.from('members').insert([
      {
        full_name,
        email,
        phone,
        block_number,
        is_executive,
        member_id: user.id,
      },
    ]);

    if (error) {
      console.error('Error adding new member:', error);
      setError(error);
    } else {
      setShowForm(false);
      setNewMember({
        id: '',
        full_name: '',
        email: '',
        phone: '',
        block_number: '',
        is_executive: false,
      });
      fetchMembers();
    }
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const { data, error } = await supabase.storage
        .from('member-photos')
        .upload(`public/${file.name}`, file);

      if (error) {
        console.error('Error uploading photo:', error);
      } else {
        console.log('Photo uploaded successfully:', data);
        // You can now save the photo URL to the member's record
        const photoUrl = `https://your-supabase-url.supabase.co/storage/v1/object/public/member-photos/${file.name}`;
        // Save this URL to the member's record if needed
      }
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* History Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Our History</h2>
          <div className="bg-white rounded-lg shadow-md p-6">
            <p className="text-gray-600 leading-relaxed">
              Huda Colony was established in 1995 as a planned residential community, designed to provide modern living spaces while fostering a strong sense of community. Over the years, we have grown from a small settlement of 50 families to a thriving community of over 500 households. Our community has been at the forefront of implementing sustainable living practices and creating inclusive spaces for all residents.
            </p>
          </div>
        </section>

        {/* Executive Members Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Executive Members</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {executives.map((executive) => (
              <div key={executive.id} className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{executive.full_name}</h3>
                <p className="text-gray-600 mb-1">Block: {executive.block_number}</p>
                <p className="text-gray-600 mb-1">Email: {executive.email}</p>
                <p className="text-gray-600">Phone: {executive.phone}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Member Directory Section */}
        <section>
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Member Directory</h2>
          
          {/* Search Bar */}
          <div className="mb-6 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search by name or block number..."
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Members Table */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              {error && <div>Error loading members: {error.message}</div>}
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Photo</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" onClick={() => handleSort('full_name')}>
                      Name {sortField === 'full_name' && (sortOrder === 'asc' ? <ChevronUp /> : <ChevronDown />)}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" onClick={() => handleSort('block_number')}>
                      Block Number {sortField === 'block_number' && (sortOrder === 'asc' ? <ChevronUp /> : <ChevronDown />)}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" onClick={() => handleSort('email')}>
                      Email {sortField === 'email' && (sortOrder === 'asc' ? <ChevronUp /> : <ChevronDown />)}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" onClick={() => handleSort('phone')}>
                      Phone {sortField === 'phone' && (sortOrder === 'asc' ? <ChevronUp /> : <ChevronDown />)}
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {paginatedMembers.map((member) => (
                    <tr key={member.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {member.photo_url && member.photo_url !== 'NA' ? (
                          <img src={member.photo_url} alt={member.full_name} className="w-12 h-12 rounded-full" />
                        ) : (
                          'NA'
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{member.full_name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{member.block_number}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{member.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{member.phone}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 sm:px-6">
              <div className="flex justify-between items-center">
                <div className="flex-1">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-3 py-1 border border-gray-300 rounded-md text-sm leading-5 font-medium text-gray-500 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    Previous
                  </button>
                  {Array.from({ length: totalFilteredPages }, (_, index) => (
                    <button
                      key={index}
                      onClick={() => handlePageChange(index + 1)}
                      disabled={currentPage === index + 1}
                      className={`px-3 py-1 border border-gray-300 rounded-md text-sm leading-5 font-medium ${currentPage === index + 1 ? 'bg-indigo-500 text-white' : 'text-gray-500'} hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500`}
                    >
                      {index + 1}
                    </button>
                  ))}
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalFilteredPages}
                    className="px-3 py-1 border border-gray-300 rounded-md text-sm leading-5 font-medium text-gray-500 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Add New Member Section */}
        <section className="mt-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Add New Member</h2>
          <button
            onClick={() => setShowForm(!showForm)}
            className="px-4 py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            {showForm ? 'Cancel' : 'Add New Member'}
          </button>

          {showForm && (
            <form onSubmit={handleSubmit} className="mt-4">
              <input
                type="text"
                name="full_name"
                placeholder="Full Name"
                value={newMember.full_name}
                onChange={handleInputChange}
                required
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={newMember.email}
                onChange={handleInputChange}
                required
              />
              <input
                type="text"
                name="phone"
                placeholder="Phone"
                value={newMember.phone}
                onChange={handleInputChange}
                required
              />
              <input
                type="text"
                name="block_number"
                placeholder="Block Number"
                value={newMember.block_number}
                onChange={handleInputChange}
                required
              />
              {userRole === 'admin' && (
                <input
                  type="file"
                  name="photo"
                  onChange={handlePhotoUpload}
                  required
                />
              )}
              <button type="submit">Submit</button>
            </form>
          )}
        </section>
      </div>
    </div>
  );
}

export default About;