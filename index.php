<!doctype html>
<html lang="en">
<?php
$data = file_get_contents('cache/posts.json');
$users = file_get_contents('cache/users.json');
$comments = file_get_contents('cache/comments.json');
$usersObj = json_decode($users);
$dataObj = json_decode($data);
$commentsObj = json_decode($comments);
$firstLetters = array();
foreach ($dataObj as $data) {
    array_push($firstLetters, substr($data->title, 0, 1));
}
$firstLetters = array_unique($firstLetters);
?>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>QuickClasses | filter, Pagination and Sorting Javascript Libraries</title>
    <meta name="description" content="Vanilla Javascript classes that make filtering, pagination and sorting easy and quick. QuickFilter, QuickSorting and QuickPagination">
    <link rel="stylesheet" href="css/bootstrap.css">
    <link rel="stylesheet" href="css/styles.css">
</head>

<body class="bg-light">
    <header class="bg-white">
        <div class="container">
            <h1 class="col py-2 display-4">Quick - Filters, Pagination and Sorting</h1>
        </div>
        <nav class="col navbar navbar-expand navbar-light">
            <div class="container">
                <div class="collapse navbar-collapse" id="navbarTogglerDemo01">
                    <ul class="navbar-nav me-auto mb-2 mb-lg-0 flex-column flex-sm-row">
                        <li class="nav-item">
                            <a class="nav-link" aria-current="page" href="#documentation">Documentation</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="#demo">Demo example</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="#footer">Description</a>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    </header>
    <main class="py-5">
        <section class="container mb-5" id="documentation">
            <div class="row">
                <div class="col-lg-12">
                    <h2 class="display-6 my-4">Javascript classes that make filtering, pagination and sorting easy and quick.</h2>
                    <p class="lead">Also available as es6 modules <a href="#modules">here</a>.</p>
                    <p class="main-cta">
                        <a href="/js/QuickClasses.min.js" download class="btn btn-primary"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-download" viewBox="0 0 16 16"><path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z"/><path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3z"/></svg> Download QuickClasses <small><span class="badge bg-info">3.7kB gzipped</span></small></a>
                    </p>
                    <hr class="my-5">
                </div>
                <div class="col-lg-6">
                    <?php echo file_get_contents('docs/quickfilter.html'); ?>
                    <?php echo file_get_contents('docs/quicksorting.html'); ?>
                </div>
                <div class="col-lg-6">
                    <?php echo file_get_contents('docs/quickpagination.html'); ?>
                    <?php echo file_get_contents('docs/quickmodules.html'); ?>
                </div>
            </div>
            <hr class="my-5">
        </section>
        <section class="container" id="demo">
            <div class="row">
                <div class="col-12">
                    <h2 class="display-6 my-5">QuickClasses Demo - Filtering, Sorting and Pagination</h2>
                </div>
                <div class="col-md-6 col-lg-3">
                    <div id="sidebar" class="card mb-3 rounded-3 shadow-sm">
                        <div class="card-body">
                            <h2 class="card-title">Filters</h2>
                            <div class="form-group mb-3">
                                <label for="Search">Search content and title</label>
                                <input type="text" class="form-control" id="Search" data-filter="text" placeholder="Search  content and title...">
                            </div>
                            <div class="form-group mb-3">
                                <label for="Commenters">Search commenters</label>
                                <input type="text" class="form-control" id="Commenters" data-filter="commenters" placeholder="Search commenters...">
                            </div>
                            <div class="form-group mb-3">
                                <label for="Author">Author</label>
                                <?php foreach ($usersObj as $user) : ?>
                                    <div class="form-check">
                                        <input data-filter="name" class="form-check-input" id="<?php echo $user->name; ?>" type="checkbox" value="<?php echo $user->name; ?>">
                                        <label class="form-check-label" for="<?php echo $user->name; ?>"><?php echo $user->name; ?></label>
                                    </div>
                                <?php endforeach; ?>
                            </div>
                            <div class="form-group mb-3">
                                <label for="beginletter">Begin letter</label>
                                <select name="beginLetter" id="beginLetter" data-filter="firstletter" class="form-select" title="First letter">
                                    <option value="">Any</option>
                                    <?php foreach ($firstLetters as $letter): ?>
                                        <option value="<?php echo $letter; ?>"><?php echo $letter; ?></option>
                                    <?php endforeach; ?>
                                </select>
                            </div>
                            <div class="form-group mb-3">
                                <label for="commentcounts" class="form-label">Amount of comments</label>
                                <div class="range-wrapper position-relative">
                                    <output class="range-min-value range-value">-</output>
                                    <output class="range-max-value range-value">+</output>
                                    <input type="range" class="form-range" multiple steps="1" value="0,5" min="0" max="5" id="commentcounts" data-filter="count">
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-md-6 col-lg-9">
                    <div id="sort-wrapper">
                        <div class="form-group row">
                            <div class="col">
                                <label for="sort-select" class="form-label">Sort by:</label>
                            </div>
                            <div class="col mb-3">
                                <select name="sort" id="sort-select" class="form-select">
                                    <option selected value="index-desc" data-key="index" data-type="NUM" data-order="DESC">Position</option>
                                    <option value="index-asc" data-key="index" data-type="NUM" data-order="ASC">Position reverse</option>
                                    <option value="count-asc" data-key="count" data-type="NUM" data-order="ASC">Number of comments (low to high)</option>
                                    <option value="count-desc" data-key="count" data-type="NUM" data-order="DESC">Number of comments (high to low)</option>
                                    <option value="title-desc" data-key="title" data-type="CHAR" data-order="DESC">Title (z to a)</option>
                                    <option value="title-asc" data-key="title" data-type="CHAR" data-order="ASC">Title (a to z)</option>
                                    <option value="random" data-key="random">Randomize!</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    <div id="paged-posts">
                        <div id="no-results" style="display: none;" class="py-3">
                            <h3 class="text-center">No results have been found!</h3>
                        </div>
                    </div>
                    <div class="row pagination-row flex-wrap py-3 align-items-center">
                        <div class="col-md-9">
                            <div class="pagination">
                            </div>
                        </div>
                        <div id="results-count" class="col-md-3 text-end">
                            <p>Number of results: <span id="counter">-</span></p>
                        </div>
                    </div>
                    <div class="row" id="org-posts">
                        <?php
                        function getUserById($id, $usersObj)
                        {
                            foreach ($usersObj as $user) {
                                if ($user->id === $id) {
                                    return $user;
                                }
                            }
                        }
                        function getCommentsByPostId($id, $commentsObj) {
                            $comments = array();
                            foreach ($commentsObj as $comment) {
                                if ($comment->postId === $id) {
                                    array_push($comments, $comment);
                                }
                            }
                            return $comments;
                        }
                        $postCount = 0;
                        foreach ($dataObj as $obj) :
                            $userObj = getUserById($obj->userId, $usersObj);
                            $comments = getCommentsByPostId($obj->id, $commentsObj);
                            if (!isset($comments)) continue;
                            $countToRemove = random_int(1, 5); // can return 1 or 5
                            $keysToRemove = array_rand($comments, $countToRemove); // returns an int or array
                            // create the array to loop
                            foreach (\is_array($keysToRemove) ? $keysToRemove : [$keysToRemove] as $key) { 
                                unset($comments[$key]);
                            }
                            $commentCounts = count($comments);
                        ?>
                            <div class="col-md-12 col-lg-6 col-xl-4 mb-4" data-count="<?php echo $commentCounts; ?>" data-index="<?php echo $obj->id; ?>" data-name="<?php echo $userObj->name; ?>" data-text="<?php echo $obj->title; ?>" data-title="<?php echo $obj->title ?>" data-firstletter="<?php echo substr($obj->title, 0, 1); ?>" data-commenters="<?php foreach ($comments as $comment){echo $comment->email . ',';} ?>">
                                <div class="card rounded-3 shadow-sm h-100">
                                    <img loading="lazy" width="310" height="180" src="<?php echo 'https://picsum.photos/310/180?random=' . $obj->id; ?>" alt="Random image <?php echo $obj->id; ?>" class="card-img-top">
                                    <div class="card-body">
                                        <p class="card-title"><?php echo $obj->title; ?></p>
                                        <small class="text-muted">Author: <?php echo $userObj->name; ?></small>
                                        <p class="card-text"><?php echo $obj->body; ?></p>
                                    </div>
                                    <div class="list-group list-group-flush">
                                    <?php
                                    if (!empty($comments)):
                                    ?>
                                    <div class="accordion accordion-flush accordion-collapse">
                                        <div class="accordion-item">
                                            <div class="accordion-header">
                                                <button class="accordion-button collapsed">
                                                    Comments &nbsp; <span class="text-muted">(<?php echo $commentCounts; ?>)</span>
                                                </button>
                                            </div>
                                            <div class="accordion-collapse collapse">
                                                <?php
                                                    foreach ($comments as $comment) {
                                                ?>
                                                    <div class="accordion-body"><strong><?php echo $comment->email; ?></strong> <?php echo $comment->name; ?></div>
                                                <?php
                                                    }
                                                ?>
                                            </div>
                                        </div>
                                    </div>
                                    <?php
                                    endif;
                                    ?>
                                    </div>
                                </div>
                            </div>
                        <?php 
                            $postCount++;
                        endforeach; ?>
                    </div>
                </div>
            </div>
        </section>
    </main>
    <footer id="footer" class="bg-white py-5">
        <div class="container">
            <div class="row">
                <div class="col-lg-8">
                    <h3 class="display-6">Credits</h3>
                    <p>Credits for making this site possible:</p>
                    <ul>
                        <li><a href="https://getbootstrap.com/" target="_blank" rel="noopener">Bootstrap</a></li>
                        <li><a href="http://projects.verou.me/multirange/" target="_blank" rel="noopener">Multiple range slider polyfill</a></li>
                        <li><a href="https://jsonplaceholder.typicode.com/" target="_blank" rel="noopener">JSONPlaceholder</a></li>
                        <li><a href="https://unsplash.com/developers" target="_blank" rel="noopener">Unsplash image API</a></li>
                    </ul>
                </div>
            </div>
        </div>
    </footer>
    <script src="js/multirange.js" defer></script>
    <!-- <script src="js/QuickFilter.min.js" async></script> -->
    <!-- <script src="js/QuickSorting.min.js" async></script> -->
    <!-- <script src="js/QuickPagination.min.js" async></script> -->
    <!-- <script src="js/QuickClasses.min.js" defer></script>  -->
    <script type="module" src="js/scripts.js" async></script>
</body>

</html>