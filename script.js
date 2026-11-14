const resultsButton = document.getElementById('seeBtn');
const fullResults = document.getElementById('fullResults');
const resultsCopy = document.querySelector('.results-copy');
const actionPhoto = document.querySelector('.action-photo');
let resultsTransitionHandler = null;

function measureResultsHeight(expanded) {
    const previousTransition = fullResults.style.transition;
    const wasHidden = fullResults.hidden;
    const wasOpen = fullResults.classList.contains('is-open');

    fullResults.style.transition = 'none';
    fullResults.hidden = !expanded;
    fullResults.classList.toggle('is-open', expanded);
    fullResults.offsetHeight;
    const height = Math.max(window.innerHeight, resultsCopy.getBoundingClientRect().height);

    fullResults.hidden = wasHidden;
    fullResults.classList.toggle('is-open', wasOpen);
    fullResults.style.transition = previousTransition;
    fullResults.offsetHeight;

    return height;
}

function listenForResultsTransition(onComplete) {
    resultsTransitionHandler = (event) => {
        if (event.target !== fullResults || event.propertyName !== 'grid-template-rows') {
            return;
        }

        fullResults.removeEventListener('transitionend', resultsTransitionHandler);
        resultsTransitionHandler = null;
        onComplete();
    };
    fullResults.addEventListener('transitionend', resultsTransitionHandler);
}

resultsButton.addEventListener('click', () => {
    const expanded = resultsButton.getAttribute('aria-expanded') === 'true';
    const opening = !expanded;
    const canStretchPhoto = window.matchMedia('(min-width: 641px)').matches;
    const photoHeight = canStretchPhoto ? measureResultsHeight(opening) : null;

    resultsButton.setAttribute('aria-expanded', String(opening));
    resultsButton.childNodes[0].textContent = opening ? 'Show fewer results ' : 'Explore all results ';
    resultsButton.querySelector('span').textContent = opening ? '−' : '+';

    if (resultsTransitionHandler) {
        fullResults.removeEventListener('transitionend', resultsTransitionHandler);
        resultsTransitionHandler = null;
    }

    if (opening) {
        fullResults.hidden = false;
        fullResults.setAttribute('aria-hidden', 'false');
        if (canStretchPhoto) {
            actionPhoto.style.height = `${actionPhoto.getBoundingClientRect().height}px`;
            actionPhoto.offsetHeight;
        }
        listenForResultsTransition(() => {
            if (resultsButton.getAttribute('aria-expanded') === 'true' && canStretchPhoto) {
                actionPhoto.style.height = '';
            }
        });
        window.requestAnimationFrame(() => {
            if (resultsButton.getAttribute('aria-expanded') === 'true') {
                fullResults.classList.add('is-open');
                if (canStretchPhoto) {
                    actionPhoto.style.height = `${photoHeight}px`;
                }
            }
        });
        return;
    }

    fullResults.setAttribute('aria-hidden', 'true');
    if (canStretchPhoto) {
        actionPhoto.style.height = `${actionPhoto.getBoundingClientRect().height}px`;
        actionPhoto.offsetHeight;
    }
    listenForResultsTransition(() => {
        if (resultsButton.getAttribute('aria-expanded') === 'false') {
            fullResults.hidden = true;
            if (canStretchPhoto) {
                actionPhoto.style.height = '';
            }
        }
    });
    fullResults.classList.remove('is-open');
    if (canStretchPhoto) {
        window.requestAnimationFrame(() => {
            if (resultsButton.getAttribute('aria-expanded') === 'false') {
                actionPhoto.style.height = `${photoHeight}px`;
            }
        });
    }
});
