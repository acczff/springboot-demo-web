/**
 * 登录表单校验
 * 纯函数：给定输入，返回第一条不通过的错误信息；全部通过则返回空字符串
 */
export function validateLoginForm(account: string, password: string): string {
  // 1. 必填校验：账号不能为空
  if (!account.trim()) {
    return '请输入用户名！';
  }

  // 2. 格式校验：用户名只允许字母和数字，2-20位
  const usernamePattern = /^[\u4e00-\u9fa5a-zA-Z0-9]+$/;
  if (!usernamePattern.test(account.trim())) {
    return '用户名只能包含字母和数字，长度 2-20 位！';
  }

  // 3. 必填校验：密码不能为空
  if (!password) {
    return '请输入密码！';
  }

  // 4. 长度校验：密码至少 3 位
  if (password.length < 3) {
    return '密码长度不能少于 3 位！';
  }

  // 全部通过
  return '';
}
