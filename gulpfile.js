import gulp from'gulp';
import nodemon from 'gulp-nodemon';

const configPath = {
  'watcher': {
    'server': './app'
  }
};

gulp.task('server', () => {
  nodemon(
    {
      'exec': 'npm run debug',
      'watch': configPath.watcher.server
    }
  );
});

gulp.task('default', [
  'server',
]);
