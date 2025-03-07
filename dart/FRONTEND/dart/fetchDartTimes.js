async function fetchDartTime(stationElement) {
    try {
        const stationName = stationElement.textContent.trim();
        console.log(`Fetching DART time for ${stationName}...`);

        const encodedStation = encodeURIComponent(stationName);
        const response = await fetch(`http://localhost:5000/dart-time?station=${encodedStation}`);

        if (!response.ok) {
            throw new Error("Failed to fetch DART time");
        }

        const textData = await response.text();
        const parser = new DOMParser();
        const xml = parser.parseFromString(textData, "text/xml");
        const trains = Array.from(xml.getElementsByTagName("objStationData"));

        console.log(`Parsed XML Trains for ${stationName}:`, trains);

        // **限制最多显示 4 个 DART 时间**
        const maxTrains = 4;
        const limitedTrains = trains.slice(0, maxTrains);

        let trainInfo = `<h2>Live DART Times</h2>`;

        if (limitedTrains.length === 0) {
            trainInfo += "<p style='color:red;'>⚠ No upcoming DARTs for this station.</p>";
        } else {
            trainInfo += `<div class="dart-times">`;
            limitedTrains.forEach(train => {
                const trainCode = train.getElementsByTagName("Traincode")[0]?.textContent || "Unknown";
                const destination = train.getElementsByTagName("Destination")[0]?.textContent || "Unknown";
                const expArrival = train.getElementsByTagName("Exparrival")[0]?.textContent || "N/A";
                const status = train.getElementsByTagName("Status")[0]?.textContent || "Unknown";
                const minutesLeft = train.getElementsByTagName("Duein")[0]?.textContent || "--";

                // **判断方向**
                const direction = trainCode.includes("N") ? "Northbound" : "Southbound";

                // **延迟状态**
                const timeClass = status.toLowerCase().includes("delayed") ? "delayed-time" : "on-time";

                trainInfo += `
                    <div class="dart-card">
                        <div class="time-circle">
                            <span class="time">${minutesLeft}</span>
                            <span class="min-label">min</span>
                        </div>
                        <div class="dart-details">
                            <span class="direction">${direction}</span>
                            <strong>${destination}</strong>
                        </div>
                        <div class="arrival-time ${timeClass}">
                            ${expArrival}
                            ${status.toLowerCase().includes("delayed") ? "<span class='delay-text'>Delayed</span>" : ""}
                        </div>
                    </div>
                `;
            });
            trainInfo += `</div>`;
        }

        trainInfo += `
        <div class="see-more-container">
            <a href="more-times.html?station=${encodedStation}">
                <button class="see-more">See More Times</button>
            </a>
        </div>
    `;

        // **找到当前车站的 `.dropdown` 并更新 `.api-space`**
        const dropdown = stationElement.nextElementSibling; // 找到 .dropdown
        if (!dropdown) {
            console.error("Error: No dropdown found for", stationName);
            return;
        }
        
        const apiSpace = dropdown.querySelector(".api-space");
        if (!apiSpace) {
            console.error("Error: .api-space not found in dropdown for", stationName);
            return;
        }

        apiSpace.innerHTML = trainInfo;

    } catch (error) {
        console.error("Error fetching DART time:", error);
    }
}



document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll(".station").forEach(station => {
        station.addEventListener("click", function () {
            fetchDartTime(this); // 传入当前点击的 .station
        });
    });
});
