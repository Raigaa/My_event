export interface EventEntry {
    uid: string;
    slug: string;
    canonicalurl: string;
    title_fr: string;
    description_fr: string;
    longdescription_fr: string;
    conditions_fr: string;
    keywords_fr: string[];
    image: string;
    imagecredits: string | null;
    thumbnail: string;
    originalimage: string;
    updatedat: string;
    daterange_fr: string;
    firstdate_begin: string;
    firstdate_end: string;
    lastdate_begin: string;
    lastdate_end: string;
    timings: string;
    accessibility: string | null;
    accessibility_label_fr: string | null;
    location_uid: string;
    location_coordinates: {
      lon: number;
      lat: number;
    };
    location_name: string;
    location_address: string;
    location_district: string;
    location_insee: string;
    location_postalcode: string;
    location_city: string;
    location_department: string;
    location_region: string;
    location_countrycode: string;
    location_image: string | null;
    location_imagecredits: string | null;
    location_phone: string | null;
    location_website: string | null;
    location_links: string | null;
    location_tags: string | null;
    location_description_fr: string | null;
    location_access_fr: string | null;
    attendancemode: {
      id: number;
      label: {
        fr: string;
        en: string;
        it: string;
        es: string;
        de: string;
        br: string;
        io: string;
      };
    };
    onlineaccesslink: string | null;
    status: {
      id: number;
      label: {
        fr: string;
        en: string;
        io: string;
      };
    };
    age_min: number | null;
    age_max: number | null;
    originagenda_title: string;
    originagenda_uid: string;
    contributor_email: string | null;
    contributor_contactnumber: string | null;
    contributor_contactname: string | null;
    contributor_contactposition: string | null;
    contributor_organization: string | null;
    category: string | null;
    country_fr: string;
    registration: Array<{ type: string; value: string }>;
    links: Array<{ link: string }>;
  }
  
  export interface ApiResponse {
    totalCount: number;
    totalPages: number;
    currentPage: number;
    error: string | null;
    limit: number;
    data: {
      total_count: number;
      results: EventEntry[];
    };
  }
  