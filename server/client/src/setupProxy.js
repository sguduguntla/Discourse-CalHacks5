const proxy = require('http-proxy-middleware');

module.exports = (app) => {
    app.use(proxy('/api/friends/*', { target: 'http://localhost:5000' }));
    app.use(proxy('/api/friends/requests', { target: 'http://localhost:5000' }));
    app.use(proxy('/api/friends/request', { target: 'http://localhost:5000' }));
    app.use(proxy('/api/friends/request/*', { target: 'http://localhost:5000' }));
    app.use(proxy('/api/users/*', { target: 'http://localhost:5000' }));
    app.use(proxy('/api/courses/*/*', { target: 'http://localhost:5000' }));
    app.use(proxy('/api/courses/*', { target: 'http://localhost:5000' }));
    app.use(proxy('/api/courses/*/students', { target: 'http://localhost:5000' }));
    app.use(proxy('/api/posts/*', { target: 'http://localhost:5000' }));
    app.use(proxy('/api/posts/delete/*', { target: 'http://localhost:5000' }));
    app.use(proxy('/api/posts/*/like', { target: 'http://localhost:5000' }));
    app.use(proxy('/api/*', { target: 'http://localhost:5000' }));
    app.use(proxy('/auth/google', { target: 'http://localhost:5000' }));
};