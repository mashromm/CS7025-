document.addEventListener("DOMContentLoaded", function () {
    const submitButton = document.querySelector(".report-button");
    if (submitButton) {
        submitButton.addEventListener("click", function (event) {
            submitFeedback(event);
        });
    }
});

async function submitFeedback(event) {
    event.preventDefault(); // 防止页面刷新

    // 获取用户输入的数据
    const station_name = document.querySelector(".station-section .repo-step").textContent.trim();
    const category = document.querySelector(".issue-section .repo-step").textContent.trim();
    const description = document.querySelector(".description-textbox").value.trim();

    // **检查用户是否填写了所有字段**
    if (!station_name || station_name === "--option--") {
        alert("Please select a station.");
        return;
    }
    if (!category || category === "--option--") {
        alert("Please select an issue type.");
        return;
    }
    if (!description) {
        alert("Please enter a description.");
        return;
    }

    // 构建要发送的 JSON 数据
    const requestBody = { station_name, category, description };

    try {
        // 发送数据到后端
        const response = await fetch("http://localhost:5000/feedback", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
            throw new Error(`Failed to submit report: ${response.statusText}`);
        }

        // **清空输入框**
        document.querySelector(".station-section .repo-step").textContent = "--option--";
        document.querySelector(".issue-section .repo-step").textContent = "--option--";
        document.querySelector(".description-textbox").value = "";

        // **显示感谢弹窗**
        document.getElementById("thankYouPopup").style.display = "flex";

        console.log("Report submitted successfully:", requestBody);

    } catch (error) {
        console.error("Error submitting feedback:", error);
        alert("An error occurred while submitting your report. Please try again later.");
    }
}

// **关闭感谢弹窗**
document.addEventListener("DOMContentLoaded", function () {
    const popup = document.getElementById("thankYouPopup");
    if (popup) {
        popup.addEventListener("click", function () {
            popup.style.display = "none";
        });
    }
});


// 上传图片功能
function uploadImage(imageId) {
    // 检查是否已存在隐藏的 file input
    let fileInput = document.getElementById("hidden-file-input");
    if (!fileInput) {
        fileInput = document.createElement("input");
        fileInput.type = "file";
        fileInput.accept = "image/*";
        fileInput.style.display = "none";
        fileInput.id = "hidden-file-input";
        document.body.appendChild(fileInput);
    }

    // 当用户选择文件后触发
    fileInput.onchange = async function () {
        const file = fileInput.files[0];
        if (!file) return;

        // 找到对应的上传框
        const uploadBox = document.querySelector(`.upload-box[onclick="uploadImage('${imageId}')"]`);
        if (uploadBox) {
            // 生成图片预览
            const reader = new FileReader();
            reader.onload = function (e) {
                // 设置预览图样式，可根据需要调整
                uploadBox.innerHTML = `<img src="${e.target.result}" alt="Preview" style="max-width: 100%; max-height: 100%;">`;
            };
            reader.readAsDataURL(file);
        }

        // 构造 FormData 用于上传
        const formData = new FormData();
        formData.append("image", file);
        formData.append("imageId", imageId); // 可选，用来区分不同上传框

        try {
            const response = await fetch("http://localhost:5000/upload", {
                method: "POST",
                body: formData
            });
            if (!response.ok) {
                throw new Error("Image upload failed: " + response.statusText);
            }
            const result = await response.json();
            console.log("Image uploaded successfully:", result);
        } catch (error) {
            console.error("Error uploading image:", error);
        }
    };

    // 触发文件选择对话框
    fileInput.click();
}
