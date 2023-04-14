Blob 对象转 base64

```
//file 在<input> 元素上选择文件后返回的 FileList 对象中
let reader = new FileReader()
reader.readAsDataURL(file)
reader.onload = function () {
	console.log(reader.result)
}
```

base64 转 Blob 对象

```
dataURItoBlob(dataURI: string) {
  var byteString = window.atob(dataURI.split(",")[1]);
  var mimeString = dataURI.split(",")[0].split(":")[1].split(";")[0];
  var ab = new ArrayBuffer(byteString.length);
  var ia = new Uint8Array(ab);
  for (var i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }
  return new Blob([ab], { type: mimeString });
}
```

Blob 对象转 FormData 对象

```
//file 在<input> 元素上选择文件后返回的 FileList 对象中
const fd = new FormData();
fd.append("file", file);
fd.append("token", getToken() || "");
```

文件上传

> <input type="file" @change="onFileChange" />

input change 事件的机制只有 value 发生改变的时候触发，
因为第二次上传相同文件 value  不变所有不会触发 change 事件，
在第一次上传时把 value 值赋空，即拿到上传所需数据后把 input 的 value 值赋空，这样第二次上传的时候 change 事件就会触发；

```
/**
   * @description: 上传
   */
  async onFileChange(e: any) {
    const files = e.target.files;
    if (!files.length) return;
    const formData = new FormData();
    formData.append("file", files[0]);
    this.$toast.loading({
      message: "上传中...",
      forbidClick: true,
    });
    const filename = files[0].name;
    e.target.value = "";// 同一文件不能重复上传问题
    try {
      const { url } = await uploadImage(formData);
      this.$toast.success("上传成功");
    } catch (error) {
      this.$toast(`${(error as any).message}`);
    }
  }
```

文件下载

```
const setParams = Object.keys(this.listQuery)
   .map((key: string) => {
     if (key != "page" && key != "limit") { return `&${key}=${(this.listQuery as any)[key]}`; }
    })
    .join("");
const apiName = "/device/assetsCheckOrder/exportExcel";//导出接口
const link = document.createElement("a");
link.style.display = "none";
link.href = `${baseURL}${apiName}?token=${getToken()}${setParams}`;
document.body.appendChild(link);
link.click();
document.body.removeChild(link);
```
