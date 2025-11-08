"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";

// Data lists
const US_STATES = [
  "Alabama",
  "Alaska",
  "Arizona",
  "Arkansas",
  "California",
  "Colorado",
  "Connecticut",
  "Delaware",
  "Florida",
  "Georgia",
  "Hawaii",
  "Idaho",
  "Illinois",
  "Indiana",
  "Iowa",
  "Kansas",
  "Kentucky",
  "Louisiana",
  "Maine",
  "Maryland",
  "Massachusetts",
  "Michigan",
  "Minnesota",
  "Mississippi",
  "Missouri",
  "Montana",
  "Nebraska",
  "Nevada",
  "New Hampshire",
  "New Jersey",
  "New Mexico",
  "New York",
  "North Carolina",
  "North Dakota",
  "Ohio",
  "Oklahoma",
  "Oregon",
  "Pennsylvania",
  "Rhode Island",
  "South Carolina",
  "South Dakota",
  "Tennessee",
  "Texas",
  "Utah",
  "Vermont",
  "Virginia",
  "Washington",
  "West Virginia",
  "Wisconsin",
  "Wyoming",
];

const COMPANIES = [
  "Apple Inc.",
  "Microsoft Corporation",
  "Amazon.com Inc.",
  "Alphabet Inc. (Google)",
  "Meta Platforms Inc. (Facebook)",
  "Tesla Inc.",
  "JPMorgan Chase & Co.",
  "Bank of America Corp.",
  "Wells Fargo & Company",
  "Goldman Sachs Group Inc.",
  "Morgan Stanley",
  "Citigroup Inc.",
  "Johnson & Johnson",
  "Procter & Gamble Co.",
  "Walmart Inc.",
  "The Coca-Cola Company",
  "PepsiCo Inc.",
  "Intel Corporation",
  "IBM Corporation",
  "Oracle Corporation",
  "Cisco Systems Inc.",
  "NVIDIA Corporation",
  "Netflix Inc.",
  "The Walt Disney Company",
  "Verizon Communications Inc.",
  "AT&T Inc.",
  "General Electric Company",
  "Boeing Company",
  "General Motors Company",
  "Ford Motor Company",
];

const ASSOCIATIONS = [
  "American Medical Association (AMA)",
  "American Bar Association (ABA)",
  "National Education Association (NEA)",
  "American Nurses Association (ANA)",
  "American Psychological Association (APA)",
  "American Dental Association (ADA)",
  "American Institute of Certified Public Accountants (AICPA)",
  "National Association of Realtors (NAR)",
  "American Society of Civil Engineers (ASCE)",
  "Institute of Electrical and Electronics Engineers (IEEE)",
  "American Chemical Society (ACS)",
  "American Association for the Advancement of Science (AAAS)",
  "American Library Association (ALA)",
  "National Association of Social Workers (NASW)",
  "American Marketing Association (AMA)",
  "Project Management Institute (PMI)",
  "Society for Human Resource Management (SHRM)",
  "American Society of Mechanical Engineers (ASME)",
  "American Planning Association (APA)",
  "National Association of Home Builders (NAHB)",
];

export default function FormPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    stateResidence: "",
    yearResident: "",
    association: "",
    personType: "",
    school: "",
    employer: "",
    faith: "",
  });

  const [mounted, setMounted] = useState(false);
  const [showStateDropdown, setShowStateDropdown] = useState(false);
  const [showSchoolDropdown, setShowSchoolDropdown] = useState(false);
  const [showAssociationDropdown, setShowAssociationDropdown] = useState(false);
  const [universities, setUniversities] = useState<string[]>([]);
  const [loadingUniversities, setLoadingUniversities] = useState(false);
  const [schoolError, setSchoolError] = useState("");
  
  const stateInputRef = useRef<HTMLInputElement>(null);
  const schoolInputRef = useRef<HTMLInputElement>(null);
  const associationInputRef = useRef<HTMLInputElement>(null);

  // Ensure component is mounted before running client-side effects
  useEffect(() => {
    setMounted(true);
  }, []);

  const validateSchool = () => {
    if (formData.personType === "student" && formData.school) {
      // Check if the entered school is in the universities list
      const isValid = universities.some(
        (uni) => uni.toLowerCase() === formData.school.toLowerCase()
      );
      if (!isValid && formData.school.length >= 2) {
        setSchoolError("Please select a university from the list");
        return false;
      } else {
        setSchoolError("");
        return true;
      }
    }
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateSchool()) {
      return;
    }
    router.push("/connect");
  };

  const fetchUniversities = async (query: string) => {
    if (!query || query.length < 2) {
      setUniversities([]);
      return;
    }

    setLoadingUniversities(true);
    try {
      // Use Next.js API route to avoid CORS issues
      let url = `/api/universities?name=${encodeURIComponent(query)}`
      let response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      let data = await response.json();
      
      // If no results with country, try without country restriction
      if (!data || data.length === 0) {
        url = `/api/universities?name=${encodeURIComponent(query)}`;
        response = await fetch(url);
        if (response.ok) {
          data = await response.json();
        }
      }
      
      // Extract university names from the API response
      if (data && Array.isArray(data) && data.length > 0) {
        const universityNames = data
          .map((uni: any) => uni.name || "")
          .filter((name: string) => name)
          .slice(0, 50); // Limit to 50 results
        setUniversities(universityNames);
        console.log(`Found ${universityNames.length} universities for query: ${query}`);
      } else {
        console.log(`No universities found for query: ${query}`);
        setUniversities([]);
      }
    } catch (error) {
      console.error("Error fetching universities:", error);
      setUniversities([]);
    } finally {
      setLoadingUniversities(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    
    // Show dropdown when typing
    if (field === "stateResidence") {
      if (value.length > 0) {
        setShowStateDropdown(true);
      } else {
        setShowStateDropdown(false);
      }
    }
    
    if (field === "school") {
      if (value.length >= 2) {
        setShowSchoolDropdown(true);
      } else {
        setShowSchoolDropdown(false);
        setUniversities([]);
      }
    }
    
    if (field === "association" && value.length > 0) {
      setShowAssociationDropdown(true);
    } else if (field === "association" && value.length === 0) {
      setShowAssociationDropdown(false);
    }
  };

  const filterOptions = (query: string, list: string[]) => {
    if (!query) return [];
    return list.filter((item) =>
      item.toLowerCase().includes(query.toLowerCase())
    );
  };

  // Debounce university fetching
  useEffect(() => {
    if (!mounted) return;
    
    if (formData.school.length < 2) {
      setUniversities([]);
      setShowSchoolDropdown(false);
      return;
    }

    const timeoutId = setTimeout(() => {
      fetchUniversities(formData.school).then(() => {
        setShowSchoolDropdown(true);
      });
    }, 300); // 300ms debounce

    return () => clearTimeout(timeoutId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData.school, mounted]);

  const selectOption = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setShowStateDropdown(false);
    setShowSchoolDropdown(false);
    setShowAssociationDropdown(false);
    if (field === "school") {
      setSchoolError("");
    }
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    if (!mounted) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (
        stateInputRef.current &&
        !stateInputRef.current.contains(event.target as Node)
      ) {
        setShowStateDropdown(false);
      }
      if (
        schoolInputRef.current &&
        !schoolInputRef.current.contains(event.target as Node)
      ) {
        setShowSchoolDropdown(false);
      }
      if (
        associationInputRef.current &&
        !associationInputRef.current.contains(event.target as Node)
      ) {
        setShowAssociationDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [mounted]);

  return (
    <div className="min-h-screen bg-white py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-light text-black mb-2">
          Tell Us About Yourself
        </h1>
        <p className="text-gray-600 mb-8 text-sm md:text-base">
          All fields are optional, but the more you share, the better we can help you.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* State Residence */}
          <div className="relative" ref={stateInputRef}>
            <label className="block text-sm font-medium text-black mb-2">
              State Residence
            </label>
            <input
              type="text"
              value={formData.stateResidence}
              onChange={(e) => handleChange("stateResidence", e.target.value)}
              onFocus={() => {
                if (formData.stateResidence && filterOptions(formData.stateResidence, US_STATES).length > 0) {
                  setShowStateDropdown(true);
                }
              }}
              className="w-full px-4 py-3 border border-gray-300 focus:border-blue-600 focus:outline-none bg-white text-black rounded-sm"
              placeholder="Enter your state"
            />
            {showStateDropdown && filterOptions(formData.stateResidence, US_STATES).length > 0 && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-sm shadow-lg max-h-60 overflow-y-auto">
                {filterOptions(formData.stateResidence, US_STATES).map((state, index) => (
                  <div
                    key={index}
                    onClick={() => selectOption("stateResidence", state)}
                    className="px-4 py-3 hover:bg-blue-50 cursor-pointer text-black border-b border-gray-100 last:border-b-0"
                  >
                    {state}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Year Resident */}
          <div>
            <label className="block text-sm font-medium text-black mb-2">
              Year Resident
            </label>
            <input
              type="number"
              value={formData.yearResident}
              onChange={(e) => handleChange("yearResident", e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 focus:border-blue-600 focus:outline-none bg-white text-black rounded-sm"
              placeholder="How many years have you been a resident?"
            />
          </div>

          {/* Association or Club */}
          <div className="relative" ref={associationInputRef}>
            <label className="block text-sm font-medium text-black mb-2">
              Any Association or Club Part
            </label>
            <input
              type="text"
              value={formData.association}
              onChange={(e) => handleChange("association", e.target.value)}
              onFocus={() => formData.association && setShowAssociationDropdown(true)}
              className="w-full px-4 py-3 border border-gray-300 focus:border-blue-600 focus:outline-none bg-white text-black rounded-sm"
              placeholder="Enter association or club name"
            />
            {showAssociationDropdown && filterOptions(formData.association, ASSOCIATIONS).length > 0 && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-sm shadow-lg max-h-60 overflow-y-auto">
                {filterOptions(formData.association, ASSOCIATIONS).map((association, index) => (
                  <div
                    key={index}
                    onClick={() => selectOption("association", association)}
                    className="px-4 py-3 hover:bg-blue-50 cursor-pointer text-black border-b border-gray-100 last:border-b-0"
                  >
                    {association}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Type of Person */}
          <div>
            <label className="block text-sm font-medium text-black mb-2">
              Type of Person
            </label>
            <select
              value={formData.personType}
              onChange={(e) => handleChange("personType", e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 focus:border-blue-600 focus:outline-none bg-white text-black rounded-sm"
            >
              <option value="">Select an option</option>
              <option value="student">Student</option>
              <option value="retired">Retired</option>
              <option value="employment">Employment</option>
            </select>
          </div>

          {/* School (if student) */}
          {formData.personType === "student" && (
            <div className="relative" ref={schoolInputRef}>
              <label className="block text-sm font-medium text-black mb-2">
                School Studying
              </label>
              <input
                type="text"
                value={formData.school}
                onChange={(e) => {
                  handleChange("school", e.target.value);
                  setSchoolError("");
                }}
                onBlur={validateSchool}
                onFocus={() => {
                  if (formData.school.length >= 2 && universities.length > 0) {
                    setShowSchoolDropdown(true);
                  }
                }}
                className={`w-full px-4 py-3 border ${
                  schoolError ? "border-red-500" : "border-gray-300"
                } focus:border-blue-600 focus:outline-none bg-white text-black rounded-sm`}
                placeholder="Enter your school name (min 2 characters)"
              />
              {schoolError && (
                <p className="mt-1 text-sm text-red-600">{schoolError}</p>
              )}
              {showSchoolDropdown && formData.school.length >= 2 && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-sm shadow-lg max-h-60 overflow-y-auto">
                  {loadingUniversities ? (
                    <div className="px-4 py-3 text-gray-600 text-center">
                      Loading universities...
                    </div>
                  ) : universities.length > 0 ? (
                    universities.map((university, index) => (
                      <div
                        key={index}
                        onClick={() => selectOption("school", university)}
                        className="px-4 py-3 hover:bg-blue-50 cursor-pointer text-black border-b border-gray-100 last:border-b-0"
                      >
                        {university}
                      </div>
                    ))
                  ) : (
                    <div className="px-4 py-3 text-gray-600 text-center text-sm">
                      No universities found. Try a different search term.
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Employer (if employment) */}
          {formData.personType === "employment" && (
            <div>
              <label className="block text-sm font-medium text-black mb-2">
                Who is your employer?
              </label>
              <input
                type="text"
                value={formData.employer}
                onChange={(e) => handleChange("employer", e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 focus:border-blue-600 focus:outline-none bg-white text-black rounded-sm"
                placeholder="Enter your employer name"
              />
            </div>
          )}

          {/* Chosen Faith */}
          <div>
            <label className="block text-sm font-medium text-black mb-2">
              Chosen Faith
            </label>
            <input
              type="text"
              value={formData.faith}
              onChange={(e) => handleChange("faith", e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 focus:border-blue-600 focus:outline-none bg-white text-black rounded-sm"
              placeholder="Enter your faith (optional)"
            />
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              className="w-full bg-blue-600 text-white px-6 py-4 text-lg font-medium hover:bg-blue-700 transition-colors duration-200 rounded-sm"
            >
              Continue
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

