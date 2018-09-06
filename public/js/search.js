var client = algoliasearch('V15HLPY42G', '819784ac399b46aa3f65ae84b5c07428');
var index = client.initIndex('UserSchema');
//initialize autocomplete on search input (ID selector must match)
autocomplete('#aa-search-input',
{ hint: false }, {
    source: autocomplete.sources.hits(index, {hitsPerPage: 5}),
    //value to be displayed in input control after user's suggestion selection
    displayKey: 'name',
    //hash of templates used when rendering dataset
    templates: {
        //'suggestion' templating function used to render a single suggestion
        suggestion: function(suggestion) {
          return '<a href="/user/'+ suggestion.objectID +'"><span>' +
            suggestion._highlightResult.name.value + '</span></a>';
        }
    }
});