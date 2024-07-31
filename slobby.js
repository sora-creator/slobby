document.getElementById('send-button').addEventListener('click', function() {
    sendMessage();
});

document.getElementById('user-input').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        sendMessage();
    }
});

function sendMessage() {
    const userInput = document.getElementById('user-input').value;
    if (!userInput.trim()) return;

    addMessageToChat(userInput, 'user-message');
    document.getElementById('user-input').value = '';

    fetchChatbotResponse(userInput);
}

function addMessageToChat(message, className) {
    const chatBox = document.getElementById('chat-box');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${className}`;
    messageDiv.innerHTML = message.replace(/\n/g, '<br>');
    chatBox.appendChild(messageDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
}

async function fetchChatbotResponse(userInput) {
    const prompt = `
    ${userInput} 사용자 성향에 맞는 취미를 추천해주세요. 답변은 다음 형식으로 작성해주세요:
    주의: 취미1, 취미2, 취미3 사이에 줄바꿈을 하여 가독성을 높여주세요.
    주의: 예시와 같이 이모티콘을 사용하여 글을 예쁘게 꾸며주세요.
    
    취미1.
    [취미 이름]
    추천이유 : [해당 취미를 추천한 이유]

    취미2.
    [취미 이름]
    추천이유 : [해당 취미를 추천한 이유]

    취미3.
    [취미 이름]
    추천이유 : [해당 취미를 추천한 이유]


    예시:
    취미1. 🏀 스포츠 클럽 가입
    추천 이유: 다양한 사람들과 함께 운동하며 🤝 친목을 도모할 수 있어 외향적인 성향에 잘 맞습니다.
    
    취미2. ✈️ 여행 동호회 활동
    추천 이유: 새로운 사람들과 함께 여행하며 🗺️ 경험을 공유하고, 다양한 문화를 접할 수 있어 흥미롭습니다.
    
    취미3. 🎤 오픈 마이크 공연
    추천 이유: 사람들 앞에서 자신의 재능을 뽐낼 수 있어, 자아 표현과 사회적 상호작용을 동시에 즐길 수 있습니다.
    `;

    const data = [
        { "role": "system", "content": "너는 다양한 취미를 알고있는 AI 챗봇이야. 사람들 성향에 맞는 취미를 추천해줘. 답변은 프롬프트 형식을 꼭 지켜줘."},
        { "role": "user", "content": prompt }
    ];

    try {
        const response = await fetch('https://open-api.jejucodingcamp.workers.dev/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            const result = await response.json();
            const chatbotMessage = result.choices[0].message.content;
            addMessageToChat(chatbotMessage, 'bot-message');
        } else {
            addMessageToChat('API 요청에 실패했습니다.', 'bot-message');
        }
    } catch (error) {
        addMessageToChat('오류가 발생했습니다. 나중에 다시 시도해주세요.', 'bot-message');
    }
}