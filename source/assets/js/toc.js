
/**
 * Initialize on page fully loaded and update on window resize
 */
function initAndUpdate(initializers) {
    $(window).on("load", initializers)
             .resize(initializers);
}

// inspired by https://jsfiddle.net/mekwall/up4nu/
function scrollSpy(menuSelector, options) {
    var menu = $(menuSelector);
    if(!visible(menu))
        return;
    options = options || {};
    var offset = options.offset || 0;
    var activeClassName = options.activeClassName || "active";

    var scollTarget = menu.find("a").map(function() {
            var item = $($(this).attr("href"));
            if (item.length)
                return item[0]; // avoid becoming 2-dim jquery array
        }), lastId = null, active = $();

    $(window).scroll(function() {
        // Get container scroll position
        var fromTop = $(this).scrollTop() + offset;

        // Get id of current scroll item
        var id = scollTarget.filter(function() {
            return $(this).offset().top < fromTop;
        }).last().attr("id") || "";

        if (lastId !== id) {
            active.removeClass(activeClassName);
            var newActive = [];

            for(var target = menu.find("[href='#" + id + "']");
                target.length && !target.is(menu);
                target = target.parent()) {
                if(target.is("li"))
                    newActive.push(target[0]);
            }
            active = $(newActive).addClass(activeClassName).trigger("scrollspy");
            lastId = id;
        }
    });
}

// toc
$(function() {
    var tocContainer = $("#toc");
    if(!visible(tocContainer))
        return;
    var toc = tocContainer.children(), tocHeight = 0;
    initAndUpdate(function() {
        tocHeight = toc.height();
    });
    scrollSpy(tocContainer, {offset: 200});
    makeSticky(tocContainer, {within: ".post-body"});

    $(".toc-item").on("scrollspy", function() {
        var tocTop = toc.scrollTop(),
            link = $(this).children(".toc-link"),
            thisTop = link.position().top;
        // make sure the highlighted element contains no child
        if($(this).height() != link.height())
            return;
        // if the highlighted element is above current view of toc
        if(thisTop <= 0)
            toc.scrollTop(tocTop + thisTop);
        // else if below current view of toc
        else if(tocHeight <= thisTop)
            toc.scrollTop(tocTop + thisTop + link.outerHeight() - tocHeight);
    });
});