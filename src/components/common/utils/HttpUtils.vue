<script>
  import axios from 'axios';
  import qs from 'qs' // 序列化请求数据，视服务端的要求
  import tips from "./TipsUtils";
  import config from '../Config'

  function $axios(url, method, params) {
    return new Promise((resolve, reject) => {
      const instance = axios.create({
          baseURL: config.info.host,
          url: url,
          method: method,
          data: params,
          // 请求头信息
          headers: {
            'Content-Type': 'application/json;charset=UTF-8'
          },
          // 设置超时时间
          timeout: 10000,
          // 携带凭证
          withCredentials: false,
          // 返回数据类型
          responseType: 'json'
        }
      );
      // request 拦截器
      instance.interceptors.request.use(
        config => {
          // Tip: 1
          // 请求开始的时候可以结合 vuex 开启全屏的 loading 动画
          // Tip: 2
          // 根据请求方法，序列化传来的参数，根据后端需求是否序列化
          if (config.method.toLocaleLowerCase() === 'post'
            || config.method.toLocaleLowerCase() === 'put'
            || config.method.toLocaleLowerCase() === 'delete') {
            config.data = qs.stringify(config.data)
          }
          return config
        },
        error => {
          // 请求错误时做些事(接口错误、超时等)
          // Tip: 4
          //  1.判断请求超时
          if (error.code === 'ECONNABORTED' && error.message.indexOf('timeout') !== -1) {
            // return service.request(originalRequest);//例如再重复请求一次
            tips.error("请求超时")
          }
          console.log("<====================error====================>");
          console.log(error);
          return Promise.reject(error) // 在调用的那边可以拿到(catch)你想返回的错误信息
        }
      );

      // response 拦截器
      instance.interceptors.response.use(
        response => {
          let data;
          // IE9时response.data是undefined，因此需要使用response.request.responseText(Stringify后的字符串)
          if (response.data === undefined) {
            data = response.request.responseText
          } else {
            data = response.data
          }
          // 根据返回的code值来做不同的处理（和后端约定）
          switch (data.code) {
            case '':
              break;
            default:
          }
          // 若不是正确的返回code，且已经登录，就抛出错误
          // const err = new Error(data.description)

          // err.data = data
          // err.response = response

          // throw err
          return data
        },
        err => {
          if (err && err.response) {
            switch (err.response.status) {
              case 400:
                err.message = '请求错误';
                break;
              case 401:
                err.message = '未授权，请登录';
                break;
              case 403:
                err.message = '拒绝访问';
                break;
              case 404:
                err.message = `请求地址出错: ${err.response.config.url}`;
                break;
              case 408:
                err.message = '请求超时';
                break;
              case 500:
                err.message = '服务器内部错误';
                break;
              case 501:
                err.message = '服务未实现';
                break;
              case 502:
                err.message = '网关错误';
                break;
              case 503:
                err.message = '服务不可用';
                break;
              case 504:
                err.message = '网关超时';
                break;
              case 505:
                err.message = 'HTTP版本不受支持';
                break;
              default:
            }
          }
          tips.error(`ERROR: ${err}`);
          return Promise.reject(err) // 返回接口返回的错误信息
        }
      );
      //请求处理
      instance(url, method, params).then((res) => {
        console.log("<=================res================>");
        console.log(res);
        resolve(res);
      }).catch((error) => {
        reject(error);
      })
    })
  }

  export default {
    $axios
  }
</script>

