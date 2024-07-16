import toast from 'react-hot-toast';
import enTranslation from './locale/en.json'
import { store } from '../redux/store'
import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg';
import { CurrentLanguageData } from '@/redux/reuducer/languageSlice';
import { useSelector } from 'react-redux';
import { logoutSuccess } from '@/redux/reuducer/authSlice';
import { useJsApiLoader } from '@react-google-maps/api';


export const placeholderImage = (e) => {
  let settings = store.getState()?.Settings?.data?.data

  const placeholderLogo = settings?.placeholder_image
  if (placeholderLogo) {
    e.target.src = placeholderLogo;
  }
};
// check user login
// is login user check
export const isLogin = () => {
  let user = store.getState()?.UserSignup
  if (user) {
    try {
      if (user?.data?.token) {
        return true;
      }
      return false;
    } catch (error) {
      return false;
    }
  }
  return false;
}

// function for formate date or time 
export const formatDate = (createdAt) => {
  const date = new Date(createdAt);
  const now = new Date();

  const diff = now.getTime() - date.getTime();
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days === 0) {
    return "Today";
  } else if (days === 1) {
    return "Yesterday";
  } else if (days < 30) {
    return `${days} days ago`;
  } else if (days < 365) {
    const months = Math.floor(days / 30);
    return `${months} month${months > 1 ? 's' : ''} ago`;
  } else {
    const years = Math.floor(days / 365);
    return `${years} year${years > 1 ? 's' : ''} ago`;
  }
};

// Function to format large numbers as strings with K, M, and B abbreviations
export const formatPriceAbbreviated = (price) => {
  if (price >= 1000000000) {
    return (price / 1000000000).toFixed(1) + 'B';
  } else if (price >= 1000000) {
    return (price / 1000000).toFixed(1) + 'M';
  } else if (price >= 1000) {
    return (price / 1000).toFixed(1) + 'K';
  } else {
    return price?.toString();
  }
};

// utils/stickyNote.js
export const createStickyNote = () => {
  const stickyNote = document.createElement('div');
  stickyNote.style.position = 'fixed';
  stickyNote.style.bottom = '0';
  stickyNote.style.width = '100%';
  stickyNote.style.backgroundColor = '#ffffff';
  stickyNote.style.color = '#000000';
  stickyNote.style.padding = '10px';
  stickyNote.style.textAlign = 'center';
  stickyNote.style.fontSize = '14px';
  stickyNote.style.zIndex = '99999';

  const closeButton = document.createElement('span');
  closeButton.style.cursor = 'pointer';
  closeButton.style.float = 'right';
  closeButton.innerHTML = '&times;';

  closeButton.onclick = function () {
    document.body.removeChild(stickyNote);
  };

  const link = document.createElement('a');
  link.style.textDecoration = 'underline';
  link.style.color = '#3498db';
  link.innerText = 'Download Now';

  link.href = process.env.NEXT_PUBLIC_APPSTORE_ID;
  stickyNote.innerHTML = 'Chat and Notification features are not supported on this browser. For a better user experience, please use our mobile application. ';
  stickyNote.appendChild(closeButton);
  stickyNote.appendChild(link);

  document.body.appendChild(stickyNote);
};

export const t = (label) => {
  const langData = store.getState().CurrentLanguage?.language?.file_name && store.getState().CurrentLanguage?.language?.file_name[label];

  if (langData) {

    return langData;
  } else {
    return enTranslation[label];
  }
};



const ERROR_CODES = {
  'auth/user-not-found': t('userNotFound'),
  'auth/wrong-password': t('invalidPassword'),
  'auth/email-already-in-use': t('emailInUse'),
  'auth/invalid-email': t('invalidEmail'),
  'auth/user-disabled': t('userAccountDisabled'),
  'auth/too-many-requests': t('tooManyRequests'),
  'auth/operation-not-allowed': t('operationNotAllowed'),
  'auth/internal-error': t('internalError'),
  'auth/invalid-login-credentials': t('incorrectDetails'),
  'auth/invalid-credential': t('incorrectDetails')
};
// Error handling function
export const handleFirebaseAuthError = (errorCode) => {
  // Check if the error code exists in the global ERROR_CODES object
  if (ERROR_CODES.hasOwnProperty(errorCode)) {
    // If the error code exists, log the corresponding error message
    toast.error(ERROR_CODES[errorCode]);
   
  } else {
    // If the error code is not found, log a generic error message
    toast.error(`${t('errorOccurred')}:${errorCode}`)

 
  }
  // Optionally, you can add additional logic here to handle the error
  // For example, display an error message to the user, redirect to an error page, etc.
}


export const truncate = (text, maxLength) => {
  // Check if text is undefined or null
  if (!text) {
    return ""; // or handle the case as per your requirement
  }

  const stringText = String(text);

  // If the text length is less than or equal to maxLength, return the original text
  if (stringText.length <= maxLength) {
    return text;
  } else {
    // Otherwise, truncate the text to maxLength characters and append ellipsis
    return stringText?.slice(0, maxLength) + "...";
  }
}

export const formatDateMonth = (timestamp) => {
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const date = new Date(timestamp);
  const year = date.getFullYear();
  const month = months[date.getMonth()];
  const day = String(date.getDate()).padStart(2, '0');

  const formattedDate = `${month} ${parseInt(day, 10)}, ${year}`;

  return formattedDate;
};





export const loadStripeApiKey = () => {
  const STRIPEData = store.getState()?.Settings;
  const StripeKey = STRIPEData?.data?.stripe_publishable_key
  if (StripeKey) {
    ``
    return StripeKey
  }
  return false;
}


export const convertToMp3 = async (blob) => {
  // Initialize FFmpeg
  const ffmpeg = createFFmpeg({ log: true });

  try {
    // Load FFmpeg
    await ffmpeg.load();

    // Write the audio Blob to FFmpeg's file system
    ffmpeg.FS('writeFile', 'input.webm', await fetchFile(blob));

    // Run FFmpeg command to convert the audio to MP3
    await ffmpeg.run('-i', 'input.webm', 'output.mp3');

    // Read the converted MP3 file from FFmpeg's file system
    const mp3Data = ffmpeg.FS('readFile', 'output.mp3');

    // Create a Blob from the MP3 data
    const mp3Blob = new Blob([mp3Data.buffer], { type: 'audio/mp3' });

    // Return the MP3 Blob
    return mp3Blob;
  } catch (error) {
    console.error('Error converting audio to MP3:', error);
    throw error;
  } finally {
    // Clean up FFmpeg resources
    await ffmpeg.FS('unlink', 'input.webm');
    await ffmpeg.FS('unlink', 'output.mp3');
    await ffmpeg.exit();
  }
};


// check is Rtl
export const useIsRtl = () => {
  const lang = useSelector(CurrentLanguageData);
  return lang?.rtl === true;
};


export const logout = () => {
  // Dispatch the logout action
  store.dispatch(logoutSuccess());

  // Redirect to the home page
  // Router.push('/');
};



// Load Google Maps
export const loadGoogleMaps = () => {
  let settings = store.getState()?.Settings?.data?.data

  return useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: settings?.place_api_key,
    libraries: ['geometry', 'drawing', 'places'], // Include 'places' library
  });
};