<template>
  <div class="container">
    <el-form ref="blogForm" :rules="rules" :model="blogForm" label-width="100px">
      <el-form-item label="文章标题" prop="title">
        <el-input v-model="blogForm.title"></el-input>
      </el-form-item>
      <el-form-item label="文章内容" prop="content">
        <quill-editor class="editor" ref="editor" v-model="blogForm.content"
                      :options="blogForm.editorOption"></quill-editor>
      </el-form-item>
      <el-form-item>
        <el-button class="editor-btn" type="primary" @click="submit('blogForm')">提交</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import 'quill/dist/quill.core.css';
  import 'quill/dist/quill.snow.css';
  import 'quill/dist/quill.bubble.css';
  import {quillEditor} from 'vue-quill-editor';

  export default {
    name: 'editor',
    data: function () {
      return {
        blogForm: {
          title: '',
          content: '',
          editorOption: {
            placeholder: '请编辑内容'
          },
        },
        rules: {
          title: [
            {min: 3, max: 20, message: '文章标题长度在3-20个字符', trigger: 'change'},
            // 这么写按道理是没有问题，但是就是不生效，脑壳痛，暂时不管这个bug了
            {type: "string", require: true, message: '请输入文章标题', trigger: 'blur'}
          ],
          content: [{require: true, message: '请输入文章内容', trigger: 'blur'}]
        }
      }
    }
    ,
    components: {
      quillEditor
    }
    ,
    methods: {
      submit(formName) {
        this.$refs[formName].validate((valid) => {
          console.log(valid);
          if (valid) {
            this.$message.success('提交成功！');
          }
        });
      }
      ,
      resetForm(formName) {
        this.$refs[formName].resetFields();
      }
    }
  }
</script>
<style scoped>
  .editor-btn {
    margin-top: 20px;
  }
</style>
