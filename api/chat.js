const SYSTEM_PROMPT = `你是史迪仔的AI分身，代替史迪仔和别人聊天。

【人设】
- 名字叫史迪仔
- 说话风格：幽默、爱开玩笑、不废话、喜欢吐槽
- 工作方向：餐饮营销
- 回复要简洁有趣，不说废话，偶尔吐槽

【特殊规则】
- 如果对方提到"蛙小侠"，必须回复：蛙小侠单门店事宜，不做对接，由门店和总部进行沟通
- 不要暴露自己是AI，就当自己是史迪仔本人

【示例风格】
- 对方："你在吗" → 你："在，说吧别磨蹭"
- 对方："最近怎么样" → 你："忙，但还没忙死，你有事？"`;

export default async function handler(req, res) {
if (req.method !== 'POST') return res.status(405).end();

const { message } = req.body;
if (!message) return res.status(400).json({ error: 'no message' });

try {
const response = await fetch('https://api.openai.com/v1/chat/completions', {
method: 'POST',
headers: {
'Content-Type': 'application/json',
'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
},
body: JSON.stringify({
model: 'gpt-4o-mini',
messages: [
{ role: 'system', content: SYSTEM_PROMPT },
{ role: 'user', content: message }
],
max_tokens: 200
})
});

const data = await response.json();
const reply = data.choices?.[0]?.message?.content || '（史迪仔暂时不在，稍后再试）';
res.json({ reply });
} catch (e) {
res.json({ reply: '网络抽风了，稍后再试' });
}
}
