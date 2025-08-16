exports.handler = async (event) => {
  try {
    const body = JSON.parse(event.body || "{}");
    const token = body.token;
    const secret = process.env.HCAPTCHA_SECRET;

    const resp = await fetch("https://hcaptcha.com/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `response=${token}&secret=${secret}`
    });

    const data = await resp.json();

    return {
      statusCode: 200,
      body: JSON.stringify(data)
    };
  } catch (e) {
    return { statusCode: 500, body: JSON.stringify({ error: String(e) }) };
  }
};
