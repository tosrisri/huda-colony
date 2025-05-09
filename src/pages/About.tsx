import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Search } from 'lucide-react';
import { ChevronUp, ChevronDown } from 'lucide-react';
import './About.css'; // Import your CSS file for flip card styles

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
    <div className="min-h-screen bg-gray-50 pt-24 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* History Section */}
        <section className="mb-16">
          <h2 className="mb-6">Our History</h2>
          <div className="">
            <p className="text-gray-600 leading-relaxed">
              Huda Colony was established in 1995 as a planned residential community, designed to provide modern living spaces while fostering a strong sense of community. Over the years, we have grown from a small settlement of 50 families to a thriving community of over 500 households. Our community has been at the forefront of implementing sustainable living practices and creating inclusive spaces for all residents.
            </p>
          </div>
        </section>

        {/* Executive Members Section */}
        <section className="mb-16">
          <h2 className="mb-6">Executive Members</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {executives.map((executive) => (
              <div key={executive.id} className="flip-card">
                <div className="flip-card-inner">
                  {/* Front Side */}
                  <div className="flip-card-front bg-white rounded-lg shadow-md p-6 text-center">
                    {executive.photo_url && executive.photo_url !== 'NA' ? (
                      <img
                        src={executive.photo_url}
                        alt={executive.full_name}
                        className="w-20 h-20 rounded-full mx-auto mb-4"
                      />
                    ) : (
                      <div className="w-20 h-20 rounded-full bg-gray-300 mx-auto mb-4"></div>
                    )}
                    <h3 className="font-semibold text-lg">{executive.full_name}</h3>
                    <p className="text-gray-600">Block: {executive.block_number}</p>
                  </div>
                  {/* Back Side */}
                  <div className="flip-card-back bg-indigo-600 text-white rounded-lg shadow-md p-6 text-center">
                    <h3 className="font-semibold text-lg">{executive.full_name}</h3>
                    <p className="text-gray-200">Email: {executive.email}</p>
                    <p className="text-gray-200">Phone: {executive.phone}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Member Directory Section */}
        <section>
          <div className="w-full">

            <h2 className="mb-6">Member Directory</h2>

            <div className="border-b border-gray-300 my-4 bg-slate-50 p-4 rounded-lg shadow-md">
              <button
                onClick={() => setShowForm(!showForm)}
                className="hc-btn"
              >
                {showForm ? 'Cancel Adding' : 'Add New Member'}
              </button>

              {showForm && (
                <form onSubmit={handleSubmit} className="mt-4 space-y-4 flex space-x-4 items-center">
                  <input
                    type="text"
                    name="full_name"
                    placeholder="Full Name"
                    value={newMember.full_name}
                    onChange={handleInputChange}
                    required
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                  <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={newMember.email}
                    onChange={handleInputChange}
                    required
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                  <input
                    type="text"
                    name="phone"
                    placeholder="Phone"
                    value={newMember.phone}
                    onChange={handleInputChange}
                    required
                    className=" px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                  <input
                    type="text"
                    name="block_number"
                    placeholder="Block Number"
                    value={newMember.block_number}
                    onChange={handleInputChange}
                    required
                    className=" px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                  {userRole === 'admin' && (
                    <input
                      type="file"
                      name="photo"
                      onChange={handlePhotoUpload}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  )}
                  <button
                    type="submit"
                    className="px-4 py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    Submit
                  </button>
                </form>
              )}
            </div>
          </div>



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
          <div className="overflow-hidden">
            <div className="table-container">
              {error && <div className="error-message">Error loading members: {error.message}</div>}
              <table className="members-table">
                <thead>
                  <tr>
                    <th className="table-header">Photo</th>
                    <th className="table-header" onClick={() => handleSort('full_name')}>
                      Name {sortField === 'full_name' && (sortOrder === 'asc' ? <ChevronUp /> : <ChevronDown />)}
                    </th>
                    <th className="table-header" onClick={() => handleSort('block_number')}>
                      Block Number {sortField === 'block_number' && (sortOrder === 'asc' ? <ChevronUp /> : <ChevronDown />)}
                    </th>
                    <th className="table-header" onClick={() => handleSort('email')}>
                      Email {sortField === 'email' && (sortOrder === 'asc' ? <ChevronUp /> : <ChevronDown />)}
                    </th>
                    <th className="table-header" onClick={() => handleSort('phone')}>
                      Phone {sortField === 'phone' && (sortOrder === 'asc' ? <ChevronUp /> : <ChevronDown />)}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedMembers.map((member) => (
                    <tr key={member.id} className="table-row">
                      <td className="table-cell">
                        {member.photo_url && member.photo_url !== 'NA' ? (
                          <img src={member.photo_url} alt={member.full_name} className="photo" />
                        ) : (
                          'NA'
                        )}
                      </td>
                      <td className="table-cell">{member.full_name}</td>
                      <td className="table-cell">{member.block_number}</td>
                      <td className="table-cell">{member.email}</td>
                      <td className="table-cell">{member.phone}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>


            <div className="pagination-container">
              <div className="pagination">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="page-button prev"
                >
                  Previous
                </button>
                {Array.from({ length: totalFilteredPages }, (_, index) => (
                  <button
                    key={index}
                    onClick={() => handlePageChange(index + 1)}
                    disabled={currentPage === index + 1}
                    className={`page-button ${currentPage === index + 1 ? "active" : ""}`}
                  >
                    {index + 1}
                  </button>
                ))}
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalFilteredPages}
                  className="page-button next"
                >
                  Next
                </button>
              </div>
            </div>


          </div>
        </section>

        {/* Add New Member Section */}
        <section className="mt-16">
          <h2 className="mb-6">Add New Member</h2>

        </section>
      </div>
    </div>
  );
}

export default About;