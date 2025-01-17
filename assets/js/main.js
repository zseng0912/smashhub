/*=========== SERVICE WORKER (OFFLINE) ==============*/
// if ("serviceWorker" in navigator) {
//     window.addEventListener("load", () => {
//       navigator.serviceWorker
//         .register("/main/service-worker.js")
//         .then((registration) => {
//           console.log("Service Worker registered with scope:", registration.scope);
//         })
//         .catch((error) => {
//           console.error("Service Worker registration failed:", error);
//         });
//     });
//   }

/*======== NAV BAR =========*/
// Function to add the active class to the current nav link
function setActiveNavLink() {
  const activePage = window.location.pathname.split('/').pop(); // Get the current page
  const navLinks = document.querySelectorAll('.nav__link'); // Get all navigation links

  navLinks.forEach(link => {
    const linkPage = link.getAttribute('href').split('/').pop();

    // Remove active-link from all links
    link.classList.remove('active-link');

    // Add active-link only to the matching link
    if (linkPage === activePage) {
      link.classList.add('active-link');
    }
  });
  }
  
// Observe DOM changes and run the function when .nav__link is available
const observer = new MutationObserver(() => {
  if (document.querySelector('.nav__link')) {
    setActiveNavLink();
    observer.disconnect(); // Stop observing once the links are loaded
  }
});
  
// Start observing the document's body for changes
observer.observe(document.body, { childList: true, subtree: true });
  

/*======== BOOKING =========*/
let selectedDuration = 1; // Default duration set to 1 hour
let selectedSection = '';
let selectedTimeSlot = '';
let selectedVenue = '';
let selectedDate = '';

document.getElementById('duration-1').addEventListener('click', () => setDuration(1));
document.getElementById('duration-2').addEventListener('click', () => setDuration(2));
document.getElementById('evening-btn').addEventListener('click', () => setSection('evening'));
document.getElementById('night-btn').addEventListener('click', () => setSection('night'));
document.getElementById('venue-select').addEventListener('change', () => setVenue());
document.getElementById('date').addEventListener('change', () => setDate());

function setVenue() {
    selectedVenue = document.getElementById('venue-select').value;
    validateForm();
}

function setDate() {
    selectedDate = document.getElementById('date').value;
    validateForm();
}

function setDuration(duration) {
    selectedDuration = duration;
    document.getElementById('duration-1').classList.remove('active');
    document.getElementById('duration-2').classList.remove('active');
    document.getElementById(`duration-${duration}`).classList.add('active');
    updateTimeSlots();
    validateForm();
}

function setSection(section) {
    selectedSection = section;
    document.getElementById('evening-btn').classList.remove('active');
    document.getElementById('night-btn').classList.remove('active');
    document.getElementById(`${section}-btn`).classList.add('active');
    updateTimeSlots();
    validateForm();
}

function updateTimeSlots() {
    if (!selectedSection || selectedDuration === 0) return;

    const timeSlotContainer = document.getElementById('time-slot-container');
    timeSlotContainer.innerHTML = ''; // Clear previous time slots
    selectedTimeSlot = ''; // Reset selected time slot
    document.getElementById('send-btn').disabled = true; // Disable send button until time slot is selected

    let startTime = selectedSection === 'evening' ? 12 : 18; // 12:00pm for evening, 6:00pm for night
    let endTime = selectedSection === 'evening' ? 18 : 22;  // 6:00pm for evening, 10:00pm for night

    // Create time slots based on selected duration
    for (let i = startTime; i <= endTime - selectedDuration; i++) {
        const startHour = i;
        const endHour = i + selectedDuration;

        const timeSlot = `${formatTime(startHour)} - ${formatTime(endHour)}`;

        const timeSlotButton = document.createElement('button');
        timeSlotButton.classList.add('time-slot');
        timeSlotButton.textContent = timeSlot;
        timeSlotButton.type = 'button';

        // Add event listener to handle selection
        timeSlotButton.addEventListener('click', () => {
            // Remove active class from all time slot buttons
            document.querySelectorAll('.time-slot').forEach(btn => btn.classList.remove('active'));
            // Mark the clicked button as active
            timeSlotButton.classList.add('active');
            // Update selected time slot
            selectedTimeSlot = timeSlot;
            validateForm();
        });

        timeSlotContainer.appendChild(timeSlotButton);
    }
}

function formatTime(hour) {
    const ampm = hour >= 12 ? 'pm' : 'am';
    const formattedHour = hour % 12 === 0 ? 12 : hour % 12;
    return `${formattedHour}:00 ${ampm}`;
}

function validateForm() {
    // Check if all fields are selected
    const isFormComplete = selectedVenue && selectedDate && selectedDuration && selectedSection && selectedTimeSlot;
    // Enable or disable the Send button
    document.getElementById('send-btn').disabled = !isFormComplete;
}


/*======== BOOKING (VENUE SELECT) =========*/
// Load venues from JSON file
fetch("/data/venues.json")
  .then((response) => response.json())
  .then((venues) => {
      const venueSelect = document.getElementById("venue-select");

      // Populate the <select> options
      venues.forEach((venue) => {
          const option = document.createElement("option");
          option.value = venue.name;
          option.textContent = venue.name;
          option.setAttribute("data-location", venue.location);
          option.setAttribute("data-image", venue.image);
          option.setAttribute('data-contact', venue.contact);
          venueSelect.appendChild(option);
      });
  })
  .catch((error) => {
      console.error("Error loading venues:", error);
  });

  document.addEventListener('DOMContentLoaded', () => {
    // Parse query parameters
    const urlParams = new URLSearchParams(window.location.search);
    const venueParam = urlParams.get('venue'); // Get the 'venue' parameter

    if (venueParam) {
        // Wait for the venue dropdown to be populated
        const venueSelect = document.getElementById('venue-select');

        // Use a MutationObserver to detect when the dropdown options are populated
        const observer = new MutationObserver(() => {
            const options = Array.from(venueSelect.options);

            // Check if the venue exists in the dropdown options
            const matchingOption = options.find(option => option.value === venueParam);

            if (matchingOption) {
                matchingOption.selected = true; // Select the corresponding venue
                setVenue(); // Trigger the venue selection logic
                observer.disconnect(); // Stop observing after setting the venue
            }
        });

        // Start observing the dropdown for changes
        observer.observe(venueSelect, { childList: true });
    }
});

function setVenue() {
    const venueSelect = document.getElementById('venue-select');
    const selectedOption = venueSelect.options[venueSelect.selectedIndex];

    // Update the global selectedVenue variable
    selectedVenue = selectedOption.value;

    // Update the venue details in the UI
    const venueName = selectedOption.value;
    const venueLocation = selectedOption.getAttribute('data-location');
    const venueImage = selectedOption.getAttribute('data-image');

    const venueImageElement = document.getElementById('venue-booking-image');
    const venueNameElement = document.getElementById('venue-booking-name');
    const venueLocationElement = document.getElementById('venue-booking-location');

    if (venueName && venueLocation && venueImage) {
        venueImageElement.src = venueImage;
        venueImageElement.style.display = 'block'; // Make sure the image is visible
        venueNameElement.textContent = venueName; // Update venue name
        venueLocationElement.textContent = venueLocation; // Update venue location
    } else {
        // Clear details if no valid venue is selected
        venueImageElement.style.display = 'none';
        venueNameElement.textContent = '';
        venueLocationElement.textContent = '';
    }

    validateForm(); // Validate the form to enable/disable the Send button
}

// document.addEventListener('DOMContentLoaded', () => {
//     // Ask for notification permission when the page is loaded
//     if (Notification.permission === 'default') {
//         Notification.requestPermission().then(permission => {
//             if (permission !== 'granted') {
//                 alert('You have denied notification permission. Push notifications will not work.');
//             }
//         });
//     }
// });

document.getElementById('send-btn').addEventListener('click', () => {
    if (selectedVenue && selectedDate && selectedDuration && selectedSection && selectedTimeSlot) {
        const venueSelect = document.getElementById('venue-select');
        const selectedOption = venueSelect.options[venueSelect.selectedIndex];
        const contactNumber = selectedOption.getAttribute('data-contact');

        if (!contactNumber || !/^\d+$/.test(contactNumber)) {
            alert('Invalid contact number for the selected venue.');
            return;
        }

        const message = `Hello, I would like to book a court at ${selectedVenue}.
        \nDate: ${selectedDate}
        \nDuration: ${selectedDuration} hour(s)
        \nTime Slot: ${selectedTimeSlot}`;

        const whatsappURL = `https://wa.me/${contactNumber}?text=${encodeURIComponent(message)}`;
        window.open(whatsappURL, '_blank');

        // // Show push notification
        // if (Notification.permission === 'granted') {
        //     new Notification('Booking Success!', {
        //         body: 'Your booking has been successfully sent!',
        //         icon: 'https://cdn-icons-png.flaticon.com/512/1038/1038097.png' // Optional: Use an icon for the notification
        //     });
        // } else {
        //     alert('Booking Success!');
        // }
    }
});





