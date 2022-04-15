export const apiBase = 'https://kata.academy:8021/api';

export const getArticleBySlug = async (slug, token) => {
  try {
    const headers = token ? { headers: { Authorization: `Token ${token}` } } : null;

    const res = await fetch(`${apiBase}/articles/${slug}`, headers);

    if (!res.ok) throw new Error(`Something went wrong in getArticleBySlug(), received ${res.status}`);

    const { article } = await res.json();
    return article;
  } catch (err) {
    console.log(err);
  }
};

export const registerUser = async (user) => {
  try {
    const res = await fetch(`${apiBase}/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ user }),
    });
    return await res.json();
  } catch (err) {
    console.log(err);
  }
};

export const logIn = async (userData) => {
  try {
    const res = await fetch(`${apiBase}/users/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ user: userData }),
    });

    if (!res.ok) throw new Error(`Something went wrong in logIn(), received ${res.status}`);

    return await res.json();
  } catch (err) {
    console.log(err);
  }
};

export const getCurrentUser = async (token) => {
  try {
    const res = await fetch(`${apiBase}/user`, {
      headers: {
        Authorization: `Token ${token}`,
      },
    });

    if (!res.ok) throw new Error(`Something went wrong in getCurrentUser(), received ${res.status}`);

    return await res.json();
  } catch (err) {
    console.log(err);
  }
};

export const updateUser = async (user, token) => {
  try {
    const res = await fetch(`${apiBase}/user`, {
      method: 'PUT',
      headers: {
        Authorization: `Token ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ user }),
    });

    if (!res.ok) throw new Error(`Something went wrong in updateUser(), received ${res.status}`);

    return await res.json();
  } catch (err) {
    console.log(err);
  }
};

export const createArticle = async (articleData, token) => {
  try {
    const res = await fetch(`${apiBase}/articles`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Token ${token}`,
      },
      body: JSON.stringify(articleData),
    });
    return await res.json();
  } catch (err) {
    console.log(err);
  }
};

export const deleteArticle = async (slug, token) => {
  try {
    const res = await fetch(`${apiBase}/articles/${slug}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Token ${token}`,
      },
    });
    return res;
  } catch (err) {
    console.log(err);
  }
};

export const updateArticle = async (slug, token, articleData) => {
  try {
    const res = await fetch(`${apiBase}/articles/${slug}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Token ${token}`,
      },
      body: JSON.stringify(articleData),
    });
    return await res.json();
  } catch (err) {
    console.log(err);
  }
};

export const likeArticle = async (slug, token, method) => {
  try {
    const res = await fetch(`${apiBase}/articles/${slug}/favorite`, {
      method,
      headers: {
        Authorization: `Token ${token}`,
      },
    });
    return res.json();
  } catch (err) {
    console.log(err);
  }
};
