var loading = new bootstrap.Modal('#loading');

function exibe() {
    loading.show();
}
 function fecha() {
     loading.hide();
 }

function sucesso(fn) {
    return function(valor) {
        fn();
        return valor;
    };
}

axios.interceptors.request.use(sucesso(exibe));

axios.interceptors.response.use(sucesso(fecha), function (error) {
    loading.hide();
    return Promise.reject(error);
});