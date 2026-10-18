import { useState, useEffect } from 'react';
 
// CAMBIA ESTA URL por tu enlace público real de Railway
const API_URL = "https://proyecto-con-fastapi-production.up.railway.app";
 
function App() {
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [message, setMessage] = useState("");
 
  const [libros, setLibros] = useState([]);
  const [titulo, setTitulo] = useState("");
  const [autor, setAutor] = useState("");
 
  useEffect(() => {
    if (token) {
      fetchLibros();
    }
  }, [token]);
 
  const fetchLibros = async () => {
    try {
      const res = await fetch(`${API_URL}/libros/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setLibros(data);
      }
    } catch (err) {
      console.error("Error al cargar libros", err);
    }
  };
 
  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/auth/registro`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: regEmail, password: regPassword })
      });
      if (res.ok) {
        setMessage("¡Registro exitoso! Ya puedes iniciar sesión.");
      } else {
        setMessage("Error en el registro.");
      }
    } catch (err) {
      setMessage("Error de conexión.");
    }
  };
 
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const params = new URLSearchParams();
      params.append("username", email);
      params.append("password", password);
 
      const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: params
      });
 
      if (res.ok) {
        const data = await res.json();
        setToken(data.access_token);
        localStorage.setItem("token", data.access_token);
        setMessage("¡Sesión iniciada con éxito!");
      } else {
        setMessage("Credenciales incorrectas.");
      }
    } catch (err) {
      setMessage("Error de conexión.");
    }
  };
 
  const handleCreateBook = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/libros/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ titulo, autor })
      });
      if (res.ok) {
        setTitulo("");
        setAutor("");
        fetchLibros();
      }
    } catch (err) {
      console.error("Error al crear libro", err);
    }
  };
 
  const handleDeleteBook = async (id) => {
    if (!window.confirm("¿Estás seguro de que quieres eliminar este libro?")) {
      return;
    }
 
    try {
      const res = await fetch(`${API_URL}/libros/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
 
      if (res.ok) {
        // Actualizamos la lista local filtrando el libro borrado
        setLibros(libros.filter(libro => libro.id !== id));
      } else {
        console.error("No se pudo eliminar el libro");
      }
    } catch (err) {
      console.error("Error al eliminar libro", err);
    }
  };
 
  const handleLogout = () => {
    setToken("");
    localStorage.removeItem("token");
  };
 
  return (
    <div className="app">
      <h1 className="app-title">Biblioteca</h1>
 
      {message && <p className="notice" role="status">{message}</p>}
 
      {!token ? (
        <div className="auth">
          {/* Login */}
          <form onSubmit={handleLogin} className="card">
            <h2 className="card-title">Iniciar sesión</h2>
            <input className="field" type="email" placeholder="Email" aria-label="Email" value={email} onChange={e => setEmail(e.target.value)} required />
            <input className="field" type="password" placeholder="Contraseña" aria-label="Contraseña" value={password} onChange={e => setPassword(e.target.value)} required />
            <button type="submit" className="btn btn-primary btn-block">Entrar</button>
          </form>
 
          {/* Registro */}
          <form onSubmit={handleRegister} className="card">
            <h2 className="card-title">Registrarse</h2>
            <input className="field" type="email" placeholder="Email" aria-label="Email para registro" value={regEmail} onChange={e => setRegEmail(e.target.value)} required />
            <input className="field" type="password" placeholder="Contraseña" aria-label="Contraseña para registro" value={regPassword} onChange={e => setRegPassword(e.target.value)} required />
            <button type="submit" className="btn btn-secondary btn-block">Crear cuenta</button>
          </form>
        </div>
      ) : (
        <div>
          <div className="panel-header">
            <h2>Panel de libros</h2>
            <button onClick={handleLogout} className="btn btn-secondary btn-small">Cerrar sesión</button>
          </div>
 
          <form onSubmit={handleCreateBook} className="book-form">
            <input className="field" type="text" placeholder="Título" aria-label="Título" value={titulo} onChange={e => setTitulo(e.target.value)} required />
            <input className="field" type="text" placeholder="Autor" aria-label="Autor" value={autor} onChange={e => setAutor(e.target.value)} required />
            <button type="submit" className="btn btn-primary">Guardar</button>
          </form>
 
          <h3 className="section-title">Mis libros guardados</h3>
 
          {libros.length === 0 ? (
            <p className="empty">Aún no tienes libros. Agrega el primero con el formulario de arriba.</p>
          ) : (
            <ul className="book-list">
              {libros.map(libro => (
                <li key={libro.id} className="book-item">
                  <div className="book-info">
                    <strong className="book-title">{libro.titulo}</strong> - {libro.autor}
                    <span className="book-id">(ID: {libro.id})</span>
                  </div>
                  <button
                    onClick={() => handleDeleteBook(libro.id)}
                    className="btn btn-danger btn-small"
                  >
                    Eliminar
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
 
export default App;