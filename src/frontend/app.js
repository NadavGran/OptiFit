document.addEventListener('DOMContentLoaded', async function() {
    var calendarEl = document.getElementById('calendar');
    var viewToggle = document.getElementById('view-toggle');
    var athleteContentArea = document.getElementById('athlete-content-area');
    var coachContentArea = document.getElementById('coach-content-area');

    // Initialize the calendar
    var calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        customButtons: {
            myTodayButton: {
                text: 'Today',
                click: function() {
                    calendar.today();
                    setTimeout(async function() {
                        var today = new Date().toISOString().split('T')[0];
                        var todayEl = document.querySelector('.fc-daygrid-day[data-date="' + today + '"]');
                        if (todayEl) {
                            await updateSquares(today);
                            highlightSelectedDate(todayEl);
                            document.getElementById('workout-title').textContent = "Today's Workout:";
                            document.getElementById('coach-workout-title').textContent = "Today's Workout:";
                            await saveSelectedDate(today);
                        }
                    }, 10);
                }
            }
        },
        headerToolbar: {
            left: 'prev,next myTodayButton',
            center: 'title',
            right: ''
        },
        events: [],
        dateClick: async function(info) {
            await updateSquares(info.dateStr);
            highlightSelectedDate(info.dayEl);
            setWorkoutTitle(info.dateStr);
            await saveSelectedDate(info.dateStr);
        }
    });

    calendar.render();

    // Switch views based on the toggle
    viewToggle.addEventListener('change', function() {
        if (viewToggle.checked) {
            athleteContentArea.style.display = 'none';
            coachContentArea.style.display = 'block';
        } else {
            athleteContentArea.style.display = 'block';
            coachContentArea.style.display = 'none';
        }
    });

    // Function to update squares with data
    async function updateSquares(dateStr) {
        try {
            const response = await fetch(`/api/data/${dateStr}`);
            if (response.ok) {
                const data = await response.json();
                document.getElementById('data-content').textContent = data.dataContent || 'No data available';
                document.getElementById('workout-content').textContent = data.workoutContent || 'No workout available';
                document.getElementById('coach-data-content').textContent = data.dataContent || 'No data available';
                document.getElementById('coach-workout-content').textContent = data.workoutContent || 'No workout available';
            } else {
                console.error('Failed to fetch data for the date:', dateStr);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }

    // Function to highlight selected date
    function highlightSelectedDate(dayEl) {
        var selectedDateElements = document.querySelectorAll('.fc-daygrid-day-selected');
        selectedDateElements.forEach(function(element) {
            element.classList.remove('fc-daygrid-day-selected');
        });
        dayEl.classList.add('fc-daygrid-day-selected');
    }

    // Function to set the workout title
    function setWorkoutTitle(dateStr) {
        var titleElement = document.getElementById('workout-title');
        var coachTitleElement = document.getElementById('coach-workout-title');
        var today = new Date().toISOString().split('T')[0];
        if (dateStr === today) {
            titleElement.textContent = "Today's Workout:";
            coachTitleElement.textContent = "Today's Workout:";
        } else {
            titleElement.textContent = dateStr + "'s Workout:";
            coachTitleElement.textContent = dateStr + "'s Workout:";
        }
    }

    // Function to save the selected date
    async function saveSelectedDate(dateStr) {
        localStorage.setItem('selectedDate', dateStr);
    }

    // Function to update the workout content (used by coach)
    async function updateWorkoutContent(dateStr) {
        try {
            const workoutContent = document.getElementById('coach-workout-content').textContent;
            const response = await fetch(`/api/data/${dateStr}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ workoutContent: workoutContent })
            });
            if (!response.ok) {
                console.error('Failed to update the workout content:', dateStr);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }

    // Event listener for the send workout button (Coach View)
    document.getElementById('send-workout-btn').addEventListener('click', async function() {
        var dateStr = localStorage.getItem('selectedDate');
        await updateWorkoutContent(dateStr);
    });

    // Function to initialize the page with today's date
    async function initializePage() {
        var today = new Date().toISOString().split('T')[0];
        var todayEl = document.querySelector('.fc-daygrid-day[data-date="' + today + '"]');
        if (todayEl) {
            await updateSquares(today);
            highlightSelectedDate(todayEl);
            document.getElementById('workout-title').textContent = "Today's Workout:";
            document.getElementById('coach-workout-title').textContent = "Today's Workout:";
            await saveSelectedDate(today);
        }
    }

    // Initialize the page
    initializePage();

    // Handle saved date
    var savedDate = localStorage.getItem('selectedDate');
    if (savedDate) {
        calendar.gotoDate(savedDate);
        setTimeout(async function() {
            var savedDateEl = document.querySelector('.fc-daygrid-day[data-date="' + savedDate + '"]');
            if (savedDateEl) {
                await updateSquares(savedDate);
                highlightSelectedDate(savedDateEl);
                setWorkoutTitle(savedDate);
            }
        }, 10);
    } else {
        initializePage();
    }
});