document.addEventListener('DOMContentLoaded', () => {
    function parseEventURL(urlString) {
        const url = new URL(urlString);
        let params = new URLSearchParams(url.search);

        if (!params.has('count')) {
            const defaultUrl = new URL("https://countdwnapp.com/?title=Christmas&subtitle=&icon=%F0%9F%8E%85&color=%23C0392B&textColor=%23FFFFFF&format=sleeps&date=2024-12-25T00:00:00Z&alertName=None&alertValue=0&repeatName=Every%20year&repeatValue=3&effectName=Snow&effectColor=#FFFFFF&effect=*")
            params = new URLSearchParams(defaultUrl.search);
        }

        return {
            date: params.get('date'),
            color: params.get('color'),
            title: params.get('title'),
            icon: params.get('icon'),
            effectName: params.get('effectName'),
            effectColor: params.get('effectColor'),
            format: params.get('format'),
            textColor: params.get('textColor')
        };
    }

    function updateCountdown(event) {
        const now = new Date().getTime();
        const eventDate = new Date(event.date).getTime();
        const distance = eventDate - now;

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        document.getElementById('eventIcon').innerHTML = event.icon;
        document.getElementById('eventDays').innerHTML = days;
        document.getElementById('eventFormat').innerHTML = event.format + " to";
        document.getElementById('eventName').innerHTML = event.title;
        document.querySelector('.displayText').style.color = event.textColor;

        document.getElementById('days').innerText = `${days}\ndays`;
        document.getElementById('hours').innerText = `${hours}\nhours`;
        document.getElementById('minutes').innerText = `${minutes}\nmins`;
        document.getElementById('seconds').innerText = `${seconds}\nsecs`;

        document.getElementById('countdownText').innerText = formatFriendlyDate(event.date);
	    document.getElementById('countdownText').style.color = event.textColor;


        document.querySelectorAll('.countdown-item, #countdown, .displayText').forEach(el => {
            el.style.color = event.textColor;
        });

        if (distance < 0) {
            clearInterval(updateInterval);
            document.getElementById('countdown').innerHTML = "The event has started!";
        }
    }

    function startSnowEffect() {
        const snowflakeChar = '*';
        const snowflakeCount = 50;
        const body = document.body;

        for (let i = 0; i < snowflakeCount; i++) {
            const snowflake = document.createElement('div');
            snowflake.className = 'snowflake';
            snowflake.style.left = `${Math.random() * window.innerWidth}px`;
            snowflake.style.animationDuration = `${Math.random() * 3 + 2}s`;
            snowflake.style.opacity = Math.random();
            snowflake.style.fontSize = `${Math.random() * 10 + 10}px`;
            snowflake.innerHTML = snowflakeChar;
            body.appendChild(snowflake);
        }
    }

    function adjustBackgroundGradient(lighterColor, darkerColor) {
        document.body.style.background = `linear-gradient(0deg, ${lighterColor}, ${darkerColor})`;
    }

    function adjustSpotlightGradient() {
        const spotlight = document.createElement('div');
        spotlight.style.position = 'absolute';
        spotlight.style.top = '0';
        spotlight.style.left = '0';
        spotlight.style.width = '100%';
        spotlight.style.height = '100%';
        spotlight.style.background = 'radial-gradient(circle at center, rgba(255, 255, 255, 0.05), rgba(0, 0, 0, 0))';
        spotlight.style.pointerEvents = 'none';
        document.body.appendChild(spotlight);
    }

    function lightenDarkenColor(col, amt) {
        if (!col) return col;

        let usePound = false;
        if (col[0] === "#") {
            col = col.slice(1);
            usePound = true;
        }

        const num = parseInt(col, 16);
        const r = Math.min(255, Math.max(0, (num >> 16) + amt));
        const g = Math.min(255, Math.max(0, (num & 0x0000FF) + amt));
        const b = Math.min(255, Math.max(0, ((num >> 8) & 0x00FF) + amt));

        return `${usePound ? "#" : ""}${((g | (b << 8) | (r << 16)).toString(16)).padStart(6, '0')}`;
    }

    function formatFriendlyDate(dateString) {
        const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        const monthsOfYear = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

        const date = new Date(dateString);
        const dayOfWeek = daysOfWeek[date.getUTCDay()];
        const day = date.getUTCDate();
        const month = monthsOfYear[date.getUTCMonth()];
        const year = date.getUTCFullYear();

        const daySuffix = (day) => {
            if (day > 3 && day < 21) return 'th';
            switch (day % 10) {
                case 1: return "st";
                case 2: return "nd";
                case 3: return "rd";
                default: return "th";
            }
        };

        return `until ${dayOfWeek} ${day}${daySuffix(day)} ${month} ${year}`;
    }

    const currentUrl = window.location.href;
    const event = parseEventURL(currentUrl);

    if (event.color) {
        document.body.style.backgroundColor = event.color;
        const lighterColor = lightenDarkenColor(event.color, 30);
        const darkerColor = lightenDarkenColor(event.color, -60);
        adjustBackgroundGradient(lighterColor, darkerColor);
        adjustSpotlightGradient();
    }

    if (event.effectName && event.effectName.toLowerCase() === 'snow') {
        startSnowEffect();
    }

    const updateInterval = setInterval(() => updateCountdown(event), 1000);
    updateCountdown(event);
});