var gulp = require('gulp')
var gutil = require('gulp-util');
var ftp = require('vinyl-ftp');
var s3 = require('gulp-s3-upload')(config);
var mjml = require('gulp-mjml')
var replace = require('gulp-replace');
var email = require('gulp-email');
var zip = require('gulp-zip')

var options = {
  user: 'api:key-564dfgfead753fghef11c54c1fb',
  url: 'https://api.mailgun.net/v2/sandbox4825.mailgun.org/messages',
  form: {
    from: 'Arthur KATZ <akatz@digital-village.fr>',
    to: 'DVTeam.runme@previews.emailonacid.com',
    subject: 'The last dist',
  }
};

var config = {
  accessKeyId: "YOURACCESSKEY",
  secretAccessKey: "YOUACCESSSECRET"
}

gulp.task( 'ftp', function () {
  var conn = ftp.create( {
  	host:     'mywebsite.tld',
  	user:     'me',
  	password: 'mypass',
  	parallel: 10,
  	log:      gutil.log
  });

	return gulp.src( globs, { base: './img/*', buffer: false } )
		.pipe( conn.newer( '/client' ) ) // only upload newer files
		.pipe( conn.dest( '/client' ) );

});

gulp.task("s3", function() {
    gulp.src("./dir/to/upload/**")
        .pipe(s3({
            Bucket: 'your-bucket-name', //  Required
            ACL:    'public-read'       //  Needs to be user-defined
        }, {
            // S3 Constructor Options, ie:
            maxRetries: 5
        }))
    ;
});

gulp.task('mjml', function () {
  return gulp.src('./index.mjml')
    .pipe(mjml())
    .pipe(gulp.dest('./html'))
});

gulp.task('replace', function(){
  gulp.src(['./html/index.html'])
    .pipe(replace('./img/', 'http://asset.dv.cool/'))
    .pipe(gulp.dest('./html/index.html'));
});

gulp.task('email', function () {
  return gulp.src(['./html/index.html'])
    .pipe(email(options));
});

gulp.task('zip', function(){
  gulp.src('./html/*')
    .pipe(zip('archive.zip'))
    .pipe(gulp.dest('./zip/'))
});

gulp.task('default', ['ftp', 'mjml', 'replace', 'email', 'zip'], function(){

});

gulp.task('default-s3', ['s3', 'mjml', 'replace', 'email', 'zip'], function(){

});
