// app.js

document.addEventListener('DOMContentLoaded', function() {
    var calendarEl = document.getElementById('calendar');

    var calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        customButtons: {
            myTodayButton: {
                text: 'Today',
                click: function() {
                    // Navigate to today's date
                    calendar.today();

                    // Give the calendar time to navigate to the current month, then highlight today's date
                    setTimeout(function() {
                        var today = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format
                        var todayEl = document.querySelector('.fc-daygrid-day[data-date="' + today + '"]');

                        if (todayEl) {
                            // Update squares with today's date
                            updateSquares(today);

                            // Highlight today's date in the calendar
                            highlightSelectedDate(todayEl);

                            // Set workout title to "Today's Workout"
                            document.getElementById('workout-title').textContent = "Today's Workout:";

                            // Save selected date to local storage
                            saveSelectedDate(today);
                        }
                    }, 10); // Small delay to ensure the calendar has navigated
                }
            }
        },
        headerToolbar: {
            left: 'prev,next myTodayButton',
            center: 'title',
            right: ''
        },
        events: [
            {
                title: 'Event 1',
                start: '2023-06-01'
            },
            {
                title: 'Event 2',
                start: '2023-06-02'
            }
        ],
        dateClick: function(info) {
            // Handle date click event to change squares
            console.log('Clicked on: ' + info.dateStr);

            // Update squares with the clicked date
            updateSquares(info.dateStr);

            // Change the background color of the clicked date
            highlightSelectedDate(info.dayEl);

            // Set workout title to the clicked date's workout
            setWorkoutTitle(info.dateStr);

            // Save selected date to local storage
            saveSelectedDate(info.dateStr);
        }
    });

    calendar.render();

    // Load selected date from local storage on page load
    var savedDate = localStorage.getItem('selectedDate');
    if (savedDate) {
        // Navigate to the month of the saved date
        calendar.gotoDate(savedDate);

        setTimeout(function() {
            var savedDateEl = document.querySelector('.fc-daygrid-day[data-date="' + savedDate + '"]');
            if (savedDateEl) {
                // Update squares with the saved date
                updateSquares(savedDate);

                // Highlight the saved date in the calendar
                highlightSelectedDate(savedDateEl);

                // Set workout title to the saved date's workout
                setWorkoutTitle(savedDate);
            }
        }, 10); // Small delay to ensure the calendar has loaded
    } else {
        // Automatically select today's date on page load if no saved date
        setTimeout(function() {
            var today = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format
            var todayEl = document.querySelector('.fc-daygrid-day[data-date="' + today + '"]');

            if (todayEl) {
                // Update squares with today's date
                updateSquares(today);

                // Highlight today's date in the calendar
                highlightSelectedDate(todayEl);

                // Set workout title to "Today's Workout"
                document.getElementById('workout-title').textContent = "Today's Workout:";
            }
        }, 10); // Small delay to ensure the calendar has loaded
    }

    function updateSquares(dateStr) {
        document.getElementById('data-content').textContent = dateStr;
        document.getElementById('workout-content').textContent = dateStr;
    }

    function highlightSelectedDate(dayEl) {
        var selectedDateElements = document.querySelectorAll('.fc-daygrid-day-selected');
        selectedDateElements.forEach(function(element) {
            element.classList.remove('fc-daygrid-day-selected');
        });
        dayEl.classList.add('fc-daygrid-day-selected');
    }

    function setWorkoutTitle(dateStr) {
        var titleElement = document.getElementById('workout-title');
        var today = new Date().toISOString().split('T')[0];

        if (dateStr === today) {
            titleElement.textContent = "Today's Workout:";
        } else {
            titleElement.textContent = dateStr + "'s Workout:";
        }
    }

    function saveSelectedDate(dateStr) {
        localStorage.setItem('selectedDate', dateStr);
    }
});