import { describe, it, expect } from 'vitest';
import { validateLoginForm } from './validate';

describe('validateLoginForm', () => {
  // --- 通过场景 ---
  it('账号和密码都合法时，应该返回空字符串', () => {
    expect(validateLoginForm('admin', 'abc123')).toBe('');
  });

  // --- 账号失败场景 ---
  it('账号为空时，应该返回错误提示', () => {
    expect(validateLoginForm('', 'abc123')).toBe('请输入用户名！');
  });

  it('账号全是空格时，应该返回错误提示', () => {
    expect(validateLoginForm('   ', 'abc123')).toBe('请输入用户名！');
  });

  it('账号包含中文时，应该返回格式错误提示', () => {
    expect(validateLoginForm('张三', 'abc123')).toBe('用户名只能包含字母和数字，长度 2-20 位！');
  });

  it('账号只有 1 位时，应该返回格式错误提示', () => {
    expect(validateLoginForm('a', 'abc123')).toBe('用户名只能包含字母和数字，长度 2-20 位！');
  });

  // --- 密码失败场景 ---
  it('密码为空时，应该返回错误提示', () => {
    expect(validateLoginForm('admin', '')).toBe('请输入密码！');
  });

  it('密码只有 2 位时，应该返回长度错误提示', () => {
    expect(validateLoginForm('admin', 'ab')).toBe('密码长度不能少于 3 位！');
  });
});
