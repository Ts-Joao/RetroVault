import { JwtGuard } from './jwt.strategy';

describe('JwtGuard', () => {
  it('should be defined', () => {
    expect(new JwtGuard({} as any)).toBeDefined();
  });
});
