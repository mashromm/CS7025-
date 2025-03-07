document.addEventListener("DOMContentLoaded", async function () {
    // 从 URL 获取 station 参数，如果没有则默认为 "Greystones"
    const urlParams = new URLSearchParams(window.location.search);
    let stationName = urlParams.get("station") || "Greystones";

    // 设置下拉菜单触发按钮默认文本为当前站名
    const repoStep = document.querySelector(".repo-step");
    if (repoStep) {
        repoStep.textContent = stationName;
    }

    console.log(`Fetching all DART times for ${stationName}...`);
    await fetchDartTime(stationName);

    // 初始化站点下拉菜单
    await populateStationDropdown();
});

// 直接使用静态车站名称数组生成下拉菜单
async function populateStationDropdown() {
    const stationDropdown = document.querySelector(".station-dropdown");
    if (!stationDropdown) return;

    const stationNames = [
        "Howth", "Sutton", "Bayside", "Malahide", "Portmarnock", "Clongriffin",
        "Howth Junctions & Donaghmede", "Kilbarrack", "Raheny", "Harmonstown",
        "Killester", "Clontarf Road", "Docklands", "Connolly", "Tara Street",
        "Pearse", "Grand Canal Dock", "Lansdowne Road", "Sandymount", "Sydney Parade",
        "Booterstown", "Blackrock", "Seapoint", "Salthill & Monkstown", "Dun Laoghaire",
        "Sandycove & Glasthule", "Glengeary", "Dalkey", "Killiney", "Shankill",
        "Bray", "Greystones"
    ];
    stationNames.sort();

    stationDropdown.innerHTML = "";
    stationNames.forEach(station => {
        const option = document.createElement("div");
        option.classList.add("dropdown-item");
        option.textContent = station;
        option.addEventListener("click", function () {
            // 更新下拉触发按钮文本
            const trigger = document.querySelector(".repo-step");
            if (trigger) trigger.textContent = station;
            // 更新 URL 参数
            window.history.pushState(null, "", `?station=${encodeURIComponent(station)}`);
            // 获取选定站点的 DART 时间信息
            fetchDartTime(station);
            // 关闭下拉菜单
            stationDropdown.style.display = "none";
        });
        stationDropdown.appendChild(option);
    });

    // 绑定下拉触发器的点击事件以显示/隐藏下拉菜单
    const trigger = document.querySelector(".repo-step");
    if (trigger) {
        trigger.addEventListener("click", function () {
            stationDropdown.style.display = stationDropdown.style.display === "block" ? "none" : "block";
        });
    }
}

// 获取某个车站的所有 DART 时间并显示在 .api-space 内
async function fetchDartTime(stationName) {
    try {
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

        let trainInfo = `<h2>All DART Times for ${stationName}</h2>`;
        if (trains.length === 0) {
            trainInfo += "<p style='color:red; text-align:center;'>⚠ No upcoming DARTs for this station.</p>";
        } else {
            trainInfo += `<div class="dart-times">`;
            trains.forEach(train => {
                const trainCode = train.getElementsByTagName("Traincode")[0]?.textContent || "Unknown";
                const destination = train.getElementsByTagName("Destination")[0]?.textContent || "Unknown";
                const expArrival = train.getElementsByTagName("Exparrival")[0]?.textContent || "N/A";
                const status = train.getElementsByTagName("Status")[0]?.textContent || "Unknown";
                const minutesLeft = train.getElementsByTagName("Duein")[0]?.textContent || "--";

                const direction = trainCode.includes("N") ? "Northbound" : "Southbound";
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

        document.querySelector(".api-space").innerHTML = trainInfo;
    } catch (error) {
        console.error("Error fetching DART time:", error);
    }
}
