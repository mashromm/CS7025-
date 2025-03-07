async function fetchFeedbackReports(stationElement) {
    try {
        const stationName = stationElement.textContent.trim();
        console.log(`Fetching reports for ${stationName}...`);

        const encodedStation = encodeURIComponent(stationName);
        const response = await fetch(`http://localhost:5000/feedback?station=${encodedStation}`);

        if (!response.ok) {
            throw new Error("Failed to fetch reports");
        }

        const reports = await response.json();
        console.log(`Fetched reports for ${stationName}:`, reports);

        // **找到当前车站的 `.recent-reports`**
        const dropdown = stationElement.nextElementSibling; // 获取 `.dropdown`
        if (!dropdown) {
            console.error("Error: No dropdown found for", stationName);
            return;
        }

        const reportsContainer = dropdown.querySelector(".recent-reports");
        if (!reportsContainer) {
            console.error("Error: .recent-reports not found in dropdown for", stationName);
            return;
        }

        reportsContainer.innerHTML = ""; // **清空旧数据，避免重复渲染**

        if (reports.length === 0) {
            reportsContainer.innerHTML = "<p style='color:gray; text-align:center; padding:20px 0; font-size:16px;'>No reports for this station.</p>";

            return;
        }

        reports.forEach(report => {
            const reportItem = document.createElement("div");
            reportItem.classList.add("report");

            // **如果 `category` 为空，默认显示 "No Category"**
            const category = report.category && report.category.trim() ? report.category.trim() : "No Category";

            reportItem.innerHTML = `
                <div class="icon-container">
                    <img src="images/${getIcon(category)}" alt="${category} Icon" onerror="this.onerror=null; this.src='images/default.png';">
                </div>
                <div class="report-content">
                    <span class="tag">${formatDate(report.created_at)}</span>
                    <strong>${category}</strong>
                    <p>${report.description}</p>
                </div>
            `;
            reportsContainer.appendChild(reportItem);
        });

    } catch (error) {
        console.error("Error fetching reports:", error);
    }
}

function getIcon(category) {
    switch (category) { 
        case "Elevator":
        case "Elevators":
            return "lift.png";
        case "Toilets":
        case "Restroom":
        case "Restrooms":
            return "wc.png";
        case "Shelter":
            return "shelter.png";
        case "Kiosks":
        case "Kiosk":
            return "kiosk.png";
        case "Seating":
            return "seating.png";
        default:
            return "default.png"; 
    }
}


// **格式化日期**
function formatDate(timestamp) {
    return new Date(timestamp).toLocaleDateString();
}

// **绑定 `.station` 点击事件，确保 `.recent-reports` 更新当前车站**
document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll(".station").forEach(station => {
        station.addEventListener("click", function () {
            fetchFeedbackReports(this);
        });
    });
});
